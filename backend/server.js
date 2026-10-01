const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pool = require('./db');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const jwt = require('jsonwebtoken');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Garante que as colunas extras de perfil existem na tabela ONG ao iniciar o servidor
pool.query(`
    ALTER TABLE ong 
    ADD COLUMN IF NOT EXISTS responsavel VARCHAR(100), 
    ADD COLUMN IF NOT EXISTS instagram VARCHAR(100), 
    ADD COLUMN IF NOT EXISTS facebook VARCHAR(100), 
    ADD COLUMN IF NOT EXISTS site VARCHAR(100);
`).catch(() => console.log('Aviso: Estrutura da tabela ONG já atualizada.'));

// 1. Rota de Cadastro de ONG
app.post('/api/ongs/cadastro', async (req, res) => {
    const { nome, cnpj, telefone, email, senha, rua, numero, complemento, bairro, cidade, uf } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const senhaHash = await bcrypt.hash(senha, 10);
        
        const queryEndereco = `INSERT INTO endereco (logradouro, numero, complemento, bairro, cidade) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
        const resEndereco = await client.query(queryEndereco, [rua, numero, complemento, bairro, `${cidade} - ${uf}`]);
        
        const queryOng = `INSERT INTO ong (id_endereco, nome, cnpj, email, senha_hash, telefone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, cnpj`;
        const resOng = await client.query(queryOng, [resEndereco.rows[0].id, nome, cnpj, email, senhaHash, telefone]);

        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'ONG cadastrada com sucesso!', ong: resOng.rows[0] });
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro ao cadastrar ONG:', erro);
        if (erro.code === '23505') {
            if (erro.constraint === 'ong_cnpj_key') return res.status(400).json({ erro: 'Este CNPJ já se encontra registado.' });
            if (erro.constraint === 'ong_email_key') return res.status(400).json({ erro: 'Este E-mail já está a ser utilizado.' });
        }
        res.status(500).json({ erro: 'Erro interno no servidor.' });
    } finally {
        client.release();
    }
});

// 2. Rota para cadastrar Pet
app.post('/api/pets', upload.array('fotos', 5), async (req, res) => {
    const { id_ong, nome, especie, raca, sexo, idade_meses, porte, condicao_saude, descricao } = req.body;
    if (!req.files || req.files.length === 0) return res.status(400).json({ erro: 'Envie pelo menos uma foto.' });

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryPet = `INSERT INTO pet (id_ong, nome, especie, raca, sexo, idade_meses, porte, condicao_saude, descricao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`;
        const resPet = await client.query(queryPet, [id_ong, nome, especie, raca, sexo, idade_meses, porte, condicao_saude, descricao]);
        const petId = resPet.rows[0].id;

        const processamentoFotos = req.files.map(async (file, index) => {
            const nomeUnico = `pet-${petId}-${Date.now()}-${index}.webp`;
            const caminhoFicheiro = path.join(__dirname, 'uploads', nomeUnico);
            await sharp(file.buffer).resize(800, 800, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(caminhoFicheiro);
            const urlFoto = `/uploads/${nomeUnico}`;
            await client.query(`INSERT INTO foto_pet (id_pet, url_foto, foto_capa) VALUES ($1, $2, $3)`, [petId, urlFoto, index === 0]);
            return urlFoto;
        });

        const fotosSalvas = await Promise.all(processamentoFotos);
        await client.query('COMMIT'); 
        res.status(201).json({ mensagem: 'Pet cadastrado!', petId, fotos: fotosSalvas });
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro ao cadastrar pet:', erro);
        res.status(500).json({ erro: 'Falha ao cadastrar o animal.' });
    } finally {
        client.release();
    }
}); 

// 3. Rota de Solicitação de Adoção
app.post('/api/solicitacoes/adocao', async (req, res) => {
    const { id_ong, id_pet, nome, cpf, email, telefone, moradia, quintal, outrosAnimais, motivo, tempo, acompanhamento, observacoes } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const resSolicitacao = await client.query(
            `INSERT INTO solicitacao (id_ong, tipo, nome_completo, cpf, email, telefone) VALUES ($1, 'Adoção', $2, $3, $4, $5) RETURNING id`,
            [id_ong, nome, cpf, email, telefone]
        );
        await client.query(
            `INSERT INTO formulario_adocao (id_solicitacao, id_pet, tipo_moradia, possui_quintal, possui_outros_animais, motivo_adocao, tempo_disponivel, aceita_acompanhamento, observacoes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [resSolicitacao.rows[0].id, id_pet, moradia, quintal, outrosAnimais, motivo, tempo, acompanhamento, observacoes]
        );
        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Solicitação enviada com sucesso!' });
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro adoção:', erro);
        res.status(500).json({ erro: 'Falha na solicitação.' });
    } finally {
        client.release();
    }
});

// 4. Rota de Formulário de Doação
app.post('/api/solicitacoes/doacao', async (req, res) => {
    const { id_ong, nome, cpf, email, telefone, endereco, animal, especie, raca, sexo, idade, vacinas, descricao } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const resSolicitacao = await client.query(
            `INSERT INTO solicitacao (id_ong, tipo, nome_completo, cpf, email, telefone) VALUES ($1, 'Doação', $2, $3, $4, $5) RETURNING id`,
            [id_ong, nome, cpf, email, telefone]
        );
        await client.query(
            `INSERT INTO formulario_doacao (id_solicitacao, endereco_completo, nome_animal, especie, raca, sexo, idade, vacinas_tomadas, descricao_adicional) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [resSolicitacao.rows[0].id, endereco, animal, especie, raca, sexo, idade, Array.isArray(vacinas) ? vacinas.join(', ') : vacinas, descricao]
        );
        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Formulário enviado com sucesso!' });
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro doação:', erro);
        res.status(500).json({ erro: 'Falha na doação.' });
    } finally {
        client.release();
    }
});

// 5. Rota Listar Pets
app.get('/api/pets', async (req, res) => {
    try {
        // Junção corrigida com a tabela endereco para obter a cidade
        const query = `
            SELECT p.*, o.nome AS ong_nome, e.cidade AS ong_cidade,
            COALESCE(json_agg(json_build_object('id', f.id, 'url_foto', f.url_foto, 'foto_capa', f.foto_capa)) FILTER (WHERE f.id IS NOT NULL), '[]') AS fotos
            FROM pet p 
            LEFT JOIN ong o ON p.id_ong = o.id 
            LEFT JOIN endereco e ON o.id_endereco = e.id
            LEFT JOIN foto_pet f ON p.id = f.id_pet
            GROUP BY p.id, o.nome, e.cidade 
            ORDER BY p.data_cadastro DESC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (erro) {
        console.error('Erro Listar Pets:', erro);
        res.status(500).json({ erro: 'Falha ao carregar animais.' });
    }
});

// 6. Rota Listar ONGs
app.get('/api/ongs', async (req, res) => {
    try {
        const query = `
            SELECT o.*, e.logradouro, e.numero, e.complemento, e.bairro, e.cidade
            FROM ong o 
            LEFT JOIN endereco e ON o.id_endereco = e.id 
            ORDER BY o.nome ASC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (erro) {
        console.error('Erro Listar ONGs:', erro);
        res.status(500).json({ erro: 'Falha ao carregar ONGs.' });
    }
});

// 7. Rota Detalhes Pet
app.get('/api/pets/:id', async (req, res) => {
    try {
        const query = `
            SELECT p.*, o.nome AS ong_nome, o.telefone AS ong_telefone, o.email AS ong_email, e.cidade AS ong_cidade,
            COALESCE(json_agg(json_build_object('id', f.id, 'url_foto', f.url_foto, 'foto_capa', f.foto_capa)) FILTER (WHERE f.id IS NOT NULL), '[]') AS fotos
            FROM pet p 
            LEFT JOIN ong o ON p.id_ong = o.id 
            LEFT JOIN endereco e ON o.id_endereco = e.id
            LEFT JOIN foto_pet f ON p.id = f.id_pet
            WHERE p.id = $1 
            GROUP BY p.id, o.nome, o.telefone, o.email, e.cidade;
        `;
        const result = await pool.query(query, [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ erro: 'Animal não encontrado.' });
        res.status(200).json(result.rows[0]);
    } catch (erro) {
        console.error('Erro Detalhes Pet:', erro);
        res.status(500).json({ erro: 'Falha ao carregar o animal.' });
    }
});

// 8. Rota Criar Evento
app.post('/api/eventos', upload.single('imagem'), async (req, res) => {
    const { id_ong, titulo, data, hora, local_texto, descricao, tipo, publico, animais } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        let urlImagem = null;
        if (req.file) {
            const nomeUnico = `evento-${Date.now()}.webp`;
            await sharp(req.file.buffer).resize(1200, 600, { fit: 'cover' }).webp({ quality: 80 }).toFile(path.join(__dirname, 'uploads', nomeUnico));
            urlImagem = `/uploads/${nomeUnico}`;
        }
        const resEndereco = await client.query(`INSERT INTO endereco (logradouro, bairro, cidade) VALUES ($1, 'Não informado', 'Não informado') RETURNING id`, [local_texto || 'Local não especificado']);
        const descricaoCompleta = `${descricao} | Tipo: ${tipo} | Público: ${publico} | Animais: ${animais}`.trim();
        const resEvento = await client.query(`INSERT INTO evento (id_endereco, id_ong, titulo_evento, descricao, data_evento, hora_evento, url_imagem) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`, [resEndereco.rows[0].id, id_ong, titulo, descricaoCompleta, data, hora, urlImagem]);
        await client.query('COMMIT');
        res.status(201).json({ mensagem: 'Evento criado!', eventoId: resEvento.rows[0].id, url_imagem: urlImagem });
    } catch (erro) {
        await client.query('ROLLBACK');
        res.status(500).json({ erro: 'Falha ao criar o evento.' });
    } finally {
        client.release();
    }
});

// 9. Rota Login
app.post('/api/ongs/login', async (req, res) => {
    const { cnpj, senha } = req.body;
    try {
        const result = await pool.query('SELECT * FROM ong WHERE cnpj = $1', [cnpj]);
        if (result.rows.length === 0) return res.status(401).json({ erro: 'CNPJ não encontrado.' });
        const ong = result.rows[0];
        const senhaValida = await bcrypt.compare(senha, ong.senha_hash);
        if (!senhaValida) return res.status(401).json({ erro: 'Senha incorreta.' });
        const token = jwt.sign({ id: ong.id, cnpj: ong.cnpj }, process.env.JWT_SECRET || 'chave', { expiresIn: '7d' });
        res.status(200).json({ mensagem: 'Login efetuado com sucesso!', token, ong: { id: ong.id, nome: ong.nome, cnpj: ong.cnpj, email: ong.email } });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro no login.' });
    }
});

// 10. Rota Listar Eventos
app.get('/api/eventos', async (req, res) => {
    try {
        const query = `
            SELECT e.*, o.nome AS ong_nome, ender.logradouro AS local_texto
            FROM evento e 
            LEFT JOIN ong o ON e.id_ong = o.id 
            LEFT JOIN endereco ender ON e.id_endereco = ender.id 
            ORDER BY e.data_evento ASC;
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (erro) {
        res.status(500).json({ erro: 'Falha ao carregar eventos.' });
    }
});

// 11. Rota Atualizar ONG
app.put('/api/ongs/:id', async (req, res) => {
    const { id } = req.params;
    const { descricao, telefone, email, responsavel, instagram, facebook, site } = req.body;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryUpdate = `
            UPDATE ong 
            SET descricao = $1, telefone = $2, email = $3, responsavel = $4, instagram = $5, facebook = $6, site = $7
            WHERE id = $8 RETURNING *;
        `;
        const result = await client.query(queryUpdate, [descricao, telefone, email, responsavel, instagram, facebook, site, id]);

        if (result.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ erro: 'ONG não encontrada.' });
        }

        await client.query('COMMIT');
        res.status(200).json({ mensagem: 'Perfil atualizado com sucesso!', ong: result.rows[0] });
    } catch (erro) {
        await client.query('ROLLBACK');
        console.error('Erro Atualizar ONG:', erro);
        res.status(500).json({ erro: 'Erro interno ao atualizar os dados.' });
    } finally {
        client.release();
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));