import emailjs from '@emailjs/browser';

export async function enviarEmailMoedas({
  alunoNome,
  alunoEmail,
  professorNome,
  quantidade,
  mensagem,
}: {
  alunoNome: string;
  alunoEmail: string;
  professorNome: string;
  quantidade: number;
  mensagem: string;
}) {

  const response = await emailjs.send(
    import.meta.env.VITE_EMAILJS_SERVICE_ID,
    import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
    {
      aluno_nome: alunoNome,
      aluno_email: alunoEmail,
      professor_nome: professorNome,
      quantidade,
      mensagem,
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );

  return response;
}