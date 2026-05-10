import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import Login from './pages/Login'

import Ecoles from './components/ressources/Ecoles'
import Filieres from './components/ressources/Filieres'
import Specialites from './components/ressources/Specialites'
import Niveaux from './components/ressources/Niveaux'
import Cycles from './components/ressources/Cycles'
import Parcours from './components/ressources/Parcours'
import AjouterEtudiant from './components/etudiants/AjouterEtudiant'
import ListeEtudiants from './components/etudiants/ListeEtudiants'

const navItems = {
  ressources: [
    { label: '🏫 Écoles', path: '/ecoles' },
    { label: '📚 Filières', path: '/filieres' },
    { label: '🎯 Spécialités', path: '/specialites' },
    { label: '📊 Niveaux', path: '/niveaux' },
    { label: '🔄 Cycles', path: '/cycles' },
    { label: '🗺️ Parcours', path: '/parcours' },
  ],
  etudiants: [
    { label: '➕ Ajouter un étudiant', path: '/ajouter-etudiant' },
    { label: '📋 Liste des étudiants', path: '/liste-etudiants' },
  ],
}

function Sidebar({ utilisateur, onLogout }) {
  const location = useLocation()
  const [openSection, setOpenSection] = useState('ressources')

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col">
      <div className="p-5 border-b border-blue-700">
        <div className="text-3xl mb-1">🎓</div>
        <h1 className="text-lg font-bold">Institut 2iE</h1>
        <p className="text-blue-300 text-xs">Gestion des étudiants</p>
      </div>

      <div className="px-4 py-3 border-b border-blue-700 bg-blue-800">
        <p className="text-xs text-blue-300">Connecté en tant que</p>
        <p className="text-sm font-semibold truncate">{utilisateur?.nom}</p>
      </div>

      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        <div>
          <button
            onClick={() => setOpenSection(openSection === 'ressources' ? '' : 'ressources')}
            className="w-full text-left px-3 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 font-semibold flex justify-between items-center text-sm"
          >
            📁 Ressources <span>{openSection === 'ressources' ? '▲' : '▼'}</span>
          </button>
          {openSection === 'ressources' && (
            <div className="mt-1 ml-2 space-y-1">
              {navItems.ressources.map(item => (
                <Link key={item.path} to={item.path}
                  className={`block px-3 py-2 rounded-lg text-xs transition-colors ${location.pathname === item.path ? 'bg-white text-blue-900 font-bold' : 'hover:bg-blue-700 text-blue-100'}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => setOpenSection(openSection === 'etudiants' ? '' : 'etudiants')}
            className="w-full text-left px-3 py-2 rounded-lg bg-blue-800 hover:bg-blue-700 font-semibold flex justify-between items-center text-sm"
          >
            👨‍🎓 Gestion étudiants <span>{openSection === 'etudiants' ? '▲' : '▼'}</span>
          </button>
          {openSection === 'etudiants' && (
            <div className="mt-1 ml-2 space-y-1">
              {navItems.etudiants.map(item => (
                <Link key={item.path} to={item.path}
                  className={`block px-3 py-2 rounded-lg text-xs transition-colors ${location.pathname === item.path ? 'bg-white text-blue-900 font-bold' : 'hover:bg-blue-700 text-blue-100'}`}>
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-blue-700">
        <button onClick={onLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-semibold transition">
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  )
}

function Layout({ children, utilisateur, onLogout }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar utilisateur={utilisateur} onLogout={onLogout} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}

export default function App() {
  const [utilisateur, setUtilisateur] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('utilisateur')
    if (token && user) setUtilisateur(JSON.parse(user))
    setChecking(false)
  }, [])

  const handleLogin = (user) => setUtilisateur(user)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('utilisateur')
    setUtilisateur(null)
  }

  if (checking) return <div className="min-h-screen flex items-center justify-center text-blue-900 text-xl">Chargement...</div>

  if (!utilisateur) return <Login onLogin={handleLogin} />

  return (
    <Router>
      <Layout utilisateur={utilisateur} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎓</div>
              <h2 className="text-3xl font-bold text-blue-900">Bienvenue sur la plateforme 2iE</h2>
              <p className="text-gray-500 mt-2">Sélectionnez un menu à gauche pour commencer</p>
            </div>
          } />
          <Route path="/ecoles" element={<Ecoles />} />
          <Route path="/filieres" element={<Filieres />} />
          <Route path="/specialites" element={<Specialites />} />
          <Route path="/niveaux" element={<Niveaux />} />
          <Route path="/cycles" element={<Cycles />} />
          <Route path="/parcours" element={<Parcours />} />
          <Route path="/ajouter-etudiant" element={<AjouterEtudiant />} />
          <Route path="/liste-etudiants" element={<ListeEtudiants />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  )
}