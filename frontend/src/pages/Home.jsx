import React from 'react'
import Hero from '../components/Hero'
import PetsDisponiveis from '../components/PetsDisponiveis'
import ONGsParceiras from '../components/ONGsParceiras'
import SobreNos from '../components/SobreNos'

const Home = () => {
  return (
    <div className='px-4 sm:px-6 lg:px-8 py-6'>
      <Hero />
      <PetsDisponiveis />
      <ONGsParceiras />
      <SobreNos />
    </div>
  )
}

export default Home
