import { UnderConstructionPage } from '../components/UnderConstructionPage';
import { useAuth } from '../context/AuthContext';

export function RelatoriosEmpresaPage() {
  const { usuario } = useAuth();
  if (!usuario || usuario.tipo !== 'EMPRESA') return null;

  return <UnderConstructionPage title="Relatórios" />;
}
