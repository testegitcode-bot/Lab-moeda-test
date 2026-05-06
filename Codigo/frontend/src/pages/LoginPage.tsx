import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import type { Usuario, TipoUsuario } from '../types';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const usuario = await api.login(email, senha) as Usuario;
      login(usuario);

      const rotas: Record<TipoUsuario, string> = {
        ALUNO: '/dashboard/aluno',
        PROFESSOR: '/dashboard/professor',
        EMPRESA: '/dashboard/empresa',
      };
      navigate(rotas[usuario.tipo]);
    } catch (err: unknown) {
      setErro(err instanceof Error ? err.message : 'Erro ao realizar login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-400 rounded-2xl mb-4 shadow-lg">
            <svg className="w-9 h-9 text-primary-950" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zm.75-9.25a.75.75 0 00-1.5 0v2.5H7a.75.75 0 000 1.5h2.25v2.5a.75.75 0 001.5 0v-2.5H13a.75.75 0 000-1.5h-2.25v-2.5z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Moeda Estudantil</h1>
          <p className="text-primary-300 mt-1 text-sm">Faça login para continuar</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {erro}
              </div>
            )}

            <button type="submit" className="btn-primary w-full text-base py-3" disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-center text-sm text-gray-500 mb-4">Ainda não tem conta?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/cadastro/aluno"
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-800 font-medium py-2.5 px-4 rounded-lg text-sm transition-all duration-200 border border-blue-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
                Sou Aluno
              </Link>
              <Link
                to="/cadastro/empresa"
                className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-medium py-2.5 px-4 rounded-lg text-sm transition-all duration-200 border border-emerald-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Sou Empresa
              </Link>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Professores fazem login com credenciais fornecidas pela instituição.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
