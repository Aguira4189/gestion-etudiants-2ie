import { useState, useEffect } from 'react'
import api from '../../services/api'

export default function ListeEtudiants() {
  const [etudiants, setEtudiants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchEtudiants = async () => {
    setLoading(true)
    try { const res = await api.get('/etudiants'); setEtudiants(res.data) }
    catch { setEtudiants([]) }
    setLoading(false)
  }

  useEffect(() => { fetchEtudiants() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet étudiant ?')) return
    await api.delete(`/etudiants/${id}`); fetchEtudiants()
  }

  const filtered = etudiants.filter(e =>
    `${e.nom} ${e.prenoms} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-blue-900 mb-6">👨‍🎓 Liste des Étudiants</h2>
      <div className="flex justify-between items-center mb-4">
        <input className="border rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Rechercher par nom, prénom..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <span className="text-gray-500 text-sm">{filtered.length} étudiant(s)</span>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? <div className="text-center py-12 text-gray-400">Chargement...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Civilité</th>
                <th className="px-4 py-3 text-left">Nom & Prénoms</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Téléphone</th>
                <th className="px-4 py-3 text-left">Pays</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan="7" className="text-center py-8 text-gray-400">Aucun étudiant trouvé</td></tr>
                : filtered.map((e, i) => (
                  <tr key={e.id} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-500">{e.civilite_libelle || '—'}</td>
                    <td className="px-4 py-3 font-medium">{e.nom} {e.prenoms}</td>
                    <td className="px-4 py-3 text-gray-500">{e.email || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{e.telephone || '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{e.pays_libelle || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(e.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs">🗑️ Supprimer</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}