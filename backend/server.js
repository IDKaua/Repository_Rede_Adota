const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db'); // Importa a conexão com o PostgreSQL
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Configura o Multer para guardar o ficheiro na memória RAM temporariamente
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 } // Limite de 5MB por foto
});

const app = express();
app.use(cors());
app.use(express.json());

// Expõe a pasta 'uploads' para que o front-end consiga aceder às imagens via URL
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---------------------------------------------------------
// 1. Rota de Cadastro de ONG
// ---------------------------------------------------------
app.post('/api/ongs/cadastro', async (req, res) => {
    const { nome, cnpj, telefone, email, senha, rua, numero, complemento, bairro, cidade, uf } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Inicia a transação

        // Criptografa a senha antes de salvar
        const senhaHash = await bcrypt.hash(senha, 10);

        // Salva o endereço e pega o ID gerado
        const queryEndereco = `
            INSERT INTO endereco (logradouro, numero, complemento, bairro, cidade) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `;
        const valoresEndereco = [rua, numero, complemento, bairro, `${cidade} - ${uf}`];
        const resEndereco = await client.query(queryEndereco, valoresEndereco);
        const enderecoId = resEndereco.rows[0].id;

        // Salva a ONG usando o ID do endereço
        const queryOng = `
            INSERT INTO ong (id_endereco, nome, cnpj, email, senha_hash, telefone) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, cnpj
        `;
        const valoresOng = [enderecoId, nome, cnpj, email, senhaHash, telefone];
        const resOng = await client.query(queryOng, valoresOng);

        await client.query('COMMIT'); // Confirma que tudo deu certo

        res.status(201).json({ 
            mensagem: 'ONG cadastrada com sucesso!',
            ong: resOng.rows[0]
        });

    } catch (erro) {
        await client.query('ROLLBACK'); // Desfaz as inserções caso algo falhe
        console.error('Erro ao cadastrar ONG:', erro);
        
        if (erro.code === '23505') { 
            return res.status(400).json({ erro: 'CNPJ ou E-mail já estão em uso na plataforma.' });
        }
        
        res.status(500).json({ erro: 'Erro interno no servidor ao cadastrar a ONG.' });
    } finally {
        client.release();
    }
});

// ---------------------------------------------------------
// 2. Rota para cadastrar Pet com até 5 fotos
// ---------------------------------------------------------
app.post('/api/pets', upload.array('fotos', 5), async (req, res) => {
    const { id_ong, nome, especie, raca, sexo, idade_meses, porte, condicao_saude, descricao } = req.body;
    
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ erro: 'É necessário enviar pelo menos uma foto do animal.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Salva os dados do Pet no banco de dados primeiro
        const queryPet = `
            INSERT INTO pet (id_ong, nome, especie, raca, sexo, idade_meses, porte, condicao_saude, descricao) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
        `;
        const valoresPet = [id_ong, nome, especie, raca, sexo, idade_meses, porte, condicao_saude, descricao];
        const resPet = await client.query(queryPet, valoresPet);
        const petId = resPet.rows[0].id;

        // Processa cada imagem simultaneamente e salva no banco
        const processamentoFotos = req.files.map(async (file, index) => {
            const nomeUnico = `pet-${petId}-${Date.now()}-${index}.webp`;
            const caminhoFicheiro = path.join(__dirname, 'uploads', nomeUnico);

            // Otimiza a imagem com Sharp (redimensiona e converte para WebP)
            await sharp(file.buffer)
                .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(caminhoFicheiro);

            const urlFoto = `/uploads/${nomeUnico}`;
            const isCapa = index === 0; // A primeira foto enviada será a capa

            // Salva a referência da foto na tabela foto_pet
            await client.query(
                `INSERT INTO foto_pet (id_pet, url_foto, foto_capa) VALUES ($1, $2, $3)`,
                [petId, urlFoto, isCapa]
            );

            return urlFoto;
        });

        // Aguarda que todas as imagens sejam processadas
        const fotosSalvas = await Promise.all(processamentoFotos);

        await client.query('COMMIT'); 

        res.status(201).json({
            mensagem: 'Pet cadastrado com sucesso!',
            petId,
            fotos: fotosSalvas
        });

    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro ao cadastrar pet:', erro);
        res.status(500).json({ erro: 'Falha ao cadastrar o animal e processar as imagens.' });
    } finally {
        client.release();
    }
}); 

// ---------------------------------------------------------
// 3. Rota de Solicitação de Adoção
// ---------------------------------------------------------
app.post('/api/solicitacoes/adocao', async (req, res) => {
    const { id_ong, id_pet, nome, cpf, email, telefone, moradia, quintal, outrosAnimais, motivo, tempo, acompanhamento, observacoes } = req.body;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Cria o registo base na tabela solicitacao
        const resSolicitacao = await client.query(
            `INSERT INTO solicitacao (id_ong, tipo, nome_completo, cpf, email, telefone) 
             VALUES ($1, 'Adoção', $2, $3, $4, $5) RETURNING id`,
            [id_ong, nome, cpf, email, telefone]
        );
        const solicitacaoId = resSolicitacao.rows[0].id;

        // Cria os detalhes específicos na tabela formulario_adocao
        await client.query(
            `INSERT INTO formulario_adocao (id_solicitacao, id_pet, tipo_moradia, possui_quintal, possui_outros_animais, motivo_adocao, tempo_disponivel, aceita_acompanhamento, observacoes) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [solicitacaoId, id_pet, moradia, quintal, outrosAnimais, motivo, tempo, acompanhamento, observacoes]
        );

        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Solicitação de adoção enviada com sucesso!' });

    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro ao enviar adoção:', erro);
        res.status(500).json({ erro: 'Falha ao processar solicitação de adoção.' });
    } finally {
        client.release();
    }
});

// ---------------------------------------------------------
// 4. Rota de Formulário de Doação de Animal
// ---------------------------------------------------------
app.post('/api/solicitacoes/doacao', async (req, res) => {
    const { id_ong, nome, cpf, email, telefone, endereco, animal, especie, raca, sexo, idade, vacinas, descricao } = req.body;
    
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Cria o registo base na tabela solicitacao
        const resSolicitacao = await client.query(
            `INSERT INTO solicitacao (id_ong, tipo, nome_completo, cpf, email, telefone) 
             VALUES ($1, 'Doação', $2, $3, $4, $5) RETURNING id`,
            [id_ong, nome, cpf, email, telefone]
        );
        const solicitacaoId = resSolicitacao.rows[0].id;

        // Converte o array de vacinas do React para string
        const vacinasString = Array.isArray(vacinas) ? vacinas.join(', ') : vacinas;

        // Cria os detalhes específicos na tabela formulario_doacao
        await client.query(
            `INSERT INTO formulario_doacao (id_solicitacao, endereco_completo, nome_animal, especie, raca, sexo, idade, vacinas_tomadas, descricao_adicional) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [solicitacaoId, endereco, animal, especie, raca, sexo, idade, vacinasString, descricao]
        );

        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Formulário de doação enviado com sucesso!' });

    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro ao enviar doação:', erro);
        res.status(500).json({ erro: 'Falha ao processar formulário de doação.' });
    } finally {
        client.release();
    }
});
// ---------------------------------------------------------
// 5. Rota para Listar todos os Pets (com as respetivas fotos)
// ---------------------------------------------------------
app.get('/api/pets', async (req, res) => {
    try {
        // Utilizamos o json_agg do PostgreSQL para agrupar as fotos do pet num array diretamente na base de dados
        const query = `
            SELECT 
                p.*, 
                o.nome AS ong_nome,
                COALESCE(
                    json_agg(
                        json_build_object('id', f.id, 'url_foto', f.url_foto, 'foto_capa', f.foto_capa)
                    ) FILTER (WHERE f.id IS NOT NULL), '[]'
                ) AS fotos
            FROM pet p
            LEFT JOIN ong o ON p.id_ong = o.id
            LEFT JOIN foto_pet f ON p.id = f.id_pet
            GROUP BY p.id, o.nome
            ORDER BY p.data_cadastro DESC;
        `;
        const result = await pool.query(query);
        
        res.status(200).json(result.rows);
    } catch (erro) {
        console.error('Erro ao buscar pets:', erro);
        res.status(500).json({ erro: 'Falha ao carregar a lista de animais.' });
    }
});

// ---------------------------------------------------------
// 6. Rota para Listar todas as ONGs
// ---------------------------------------------------------
app.get('/api/ongs', async (req, res) => {
    try {
        const query = `
            SELECT 
                o.id, o.nome, o.email, o.telefone, o.descricao, o.capacidade_atual, o.chave_pix,
                e.logradouro, e.numero, e.complemento, e.bairro, e.cidade
            FROM ong o
            LEFT JOIN endereco e ON o.id_endereco = e.id
            ORDER BY o.nome ASC;
        `;
        const result = await pool.query(query);
        
        // Remove a senha_hash da resposta por motivos de segurança, mesmo que não a tenhamos selecionado
        res.status(200).json(result.rows);
    } catch (erro) {
        console.error('Erro ao buscar ONGs:', erro);
        res.status(500).json({ erro: 'Falha ao carregar a lista de ONGs.' });
    }
});

// ---------------------------------------------------------
// 7. Rota para Listar um Pet específico por ID
// ---------------------------------------------------------
app.get('/api/pets/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
            SELECT 
                p.*, 
                o.nome AS ong_nome, o.telefone AS ong_telefone, o.email AS ong_email,
                COALESCE(
                    json_agg(
                        json_build_object('id', f.id, 'url_foto', f.url_foto, 'foto_capa', f.foto_capa)
                    ) FILTER (WHERE f.id IS NOT NULL), '[]'
                ) AS fotos
            FROM pet p
            LEFT JOIN ong o ON p.id_ong = o.id
            LEFT JOIN foto_pet f ON p.id = f.id_pet
            WHERE p.id = $1
            GROUP BY p.id, o.nome, o.telefone, o.email;
        `;
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ erro: 'Animal não encontrado.' });
        }
        
        res.status(200).json(result.rows[0]);
    } catch (erro) {
        console.error('Erro ao buscar detalhes do pet:', erro);
        res.status(500).json({ erro: 'Falha ao carregar os detalhes do animal.' });
    }
});
// ---------------------------------------------------------
// 8. Rota de Criação de Eventos
// ---------------------------------------------------------
app.post('/api/eventos', upload.single('imagem'), async (req, res) => {
    // Extrai os campos vindos do formulário (adaptado aos campos do UI)
    const { id_ong, titulo, data, hora, local_texto, descricao, tipo, publico, animais } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Processar a imagem do banner (se enviada)
        let urlImagem = null;
        if (req.file) {
            const nomeUnico = `evento-${Date.now()}.webp`;
            const caminhoFicheiro = path.join(__dirname, 'uploads', nomeUnico);

            // Redimensiona para um formato de banner (ex: 1200x600)
            await sharp(req.file.buffer)
                .resize(1200, 600, { fit: 'cover' }) 
                .webp({ quality: 80 })
                .toFile(caminhoFicheiro);

            urlImagem = `/uploads/${nomeUnico}`;
        }

        // 2. Criar o Endereço 
        // O formulário de eventos tem apenas um campo "Local". 
        // Guardamos o texto no logradouro e usamos valores por omissão nos campos obrigatórios da tabela endereco.
        const resEndereco = await client.query(
            `INSERT INTO endereco (logradouro, bairro, cidade) 
             VALUES ($1, 'Não informado', 'Não informado') RETURNING id`,
            [local_texto || 'Local não especificado']
        );
        const enderecoId = resEndereco.rows[0].id;

        // 3. Compilar a descrição com os detalhes extra do formulário (O que levar, Animais, Público)
        const descricaoCompleta = `
            ${descricao}
            | Tipo: ${tipo} 
            | Público: ${publico} 
            | Animais: ${animais}
        `.trim();

        // 4. Salvar o Evento
        const queryEvento = `
            INSERT INTO evento (id_endereco, id_ong, titulo_evento, descricao, data_evento, hora_evento, url_imagem)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `;
        const valoresEvento = [enderecoId, id_ong, titulo, descricaoCompleta, data, hora, urlImagem];
        const resEvento = await client.query(queryEvento, valoresEvento);

        await client.query('COMMIT');
        
        res.status(201).json({ 
            mensagem: 'Evento criado com sucesso!', 
            eventoId: resEvento.rows[0].id,
            url_imagem: urlImagem
        });

    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro ao criar evento:', erro);
        res.status(500).json({ erro: 'Falha ao processar a criação do evento.' });
    } finally {
        client.release();
    }
});
// ---------------------------------------------------------
// 9. Rota de Login da ONG
// ---------------------------------------------------------
app.post('/api/ongs/login', async (req, res) => {
    // 1. Recebe os dados do front-end
    const { cnpj, senha } = req.body;

    try {
        // 2. Busca a ONG na base de dados pelo CNPJ
        const query = 'SELECT * FROM ong WHERE cnpj = $1';
        const result = await pool.query(query, [cnpj]);

        // Se não encontrar nenhuma linha, o CNPJ não existe
        if (result.rows.length === 0) {
            return res.status(401).json({ erro: 'CNPJ não encontrado na plataforma.' });
        }

        const ong = result.rows[0];

        // 3. Compara a senha digitada com a senha encriptada (hash) guardada no banco
        const senhaValida = await bcrypt.compare(senha, ong.senha_hash);

        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha incorreta. Tente novamente.' });
        }

        // 4. Cria o "crachá" de acesso (Token) válido por 7 dias
        const token = jwt.sign(
            { id: ong.id, cnpj: ong.cnpj }, 
            process.env.JWT_SECRET || 'chave_super_secreta_rede_adota', 
            { expiresIn: '7d' }
        );

        // 5. Retorna sucesso, o token e os dados essenciais (nunca a senha!)
        res.status(200).json({
            mensagem: 'Login efetuado com sucesso!',
            token,
            ong: {
                id: ong.id,
                nome: ong.nome,
                cnpj: ong.cnpj,
                email: ong.email
            }
        });

    } catch (erro) {
        console.error('Erro no login:', erro);
        res.status(500).json({ erro: 'Erro interno no servidor ao fazer login.' });
    }
});
// ---------------------------------------------------------
// Inicialização do Servidor
// ---------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));