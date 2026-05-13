import { UnderConstructionPage } from '../components/UnderConstructionPage';
import { useAuth } from '../context/AuthContext';

export function VantagensAlunoPage() {
  const { usuario } = useAuth();
  if (!usuario || usuario.tipo !== 'ALUNO') return null;

  return <UnderConstructionPage title="Minhas Vantagens" />;
}
