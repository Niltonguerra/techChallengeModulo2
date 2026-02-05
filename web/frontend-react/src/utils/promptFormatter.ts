import type { ChatMessageProps } from "../types/conversation";

export function formatConversationToPrompt(conversation: ChatMessageProps[]): string {
    const conversationHistory = conversation
        .map((msg) => `${msg.authorName}: ${msg.content}`)
        .join("\n");

    const prompt = 
    `Atue como um especialista em design instrucional. Analise o histórico de conversa enviado a seguir e gere perguntas de múltipla escolha para validar o aprendizado dos conceitos discutidos. O foco deve ser nos pontos centrais e técnicos da discussão, mantendo um tom formal e educativo. Cada pergunta deve conter obrigatoriamente quatro alternativas, identificadas pelas letras a, b, c e d, sendo apenas uma delas a resposta correta. Certifique-se de que as alternativas incorretas sejam plausíveis e evite opções genéricas como "todas as anteriores". Após listar todas as perguntas, gere um gabarito ao final indicando a alternativa correta para cada questão. Segue o histórico da conversa: ${conversationHistory}, não precisa colocar um cabeçario, como: "Perguntas geradas pelo Hook: Prezado(a) Jozxzx da Silva,A seguir, apresento perguntas de múltipla escolha elaboradas para validar seu entendimento sobre os conceitos discutidos na conversa sobre as mitocôndrias e a Teoria da Endossimbiose. As questões focam nos pontos centrais e técnicos da explanação.Perguntas geradas pelo Hook:",quero que só escreva as perguntas e o gabarito por favor, como nesse modelo:
Questão 1:
De acordo com a Teoria da Endossimbiose, a presença de DNA próprio nas mitocôndrias é melhor explicada como um:
a) Mecanismo para regular a expressão gênica do núcleo da célula hospedeira.
b) Resquício evolutivo de um passado em que a organela era um organismo procarionte independente.
c) Recurso para compensar a perda de material genético no núcleo celular durante a divisão.
d) Sistema exclusivo para a síntese de ATP, diferenciado do DNA nuclear.

Questão 2:
Qual é o evento central que descreve a origem das mitocôndrias, conforme a Teoria da Endossimbiose?
a) Uma célula eucarionte primitiva desenvolveu mitocôndrias a partir de invaginações da sua própria membrana plasmática.
b) Bactérias aeróbicas independentes foram digeridas e seus componentes reorganizados em novas organelas.
c) Uma célula eucarionte englobou uma bactéria aeróbica, estabelecendo uma relação simbiótica mutuamente benéfica.
d) Um vírus ancestral infectou uma célula eucarionte, transferindo material genético que originou as mitocôndrias.

Questão 3:
Uma evidência crucial que sustenta a Teoria da Endossimbiose, mencionada na conversa, é a característica do DNA mitocondrial. Qual das alternativas descreve corretamente essa característica?
a) O DNA mitocondrial é linear e contido em um cromossomo complexo, semelhante ao DNA eucarionte.
b) O DNA mitocondrial é exclusivamente responsável pela regulação da mitose celular.
c) O DNA mitocondrial é circular, muito semelhante ao DNA bacteriano, e permite a autoduplicação da organela.
d) O DNA mitocondrial é idêntico ao DNA nuclear, mas com uma quantidade reduzida de genes.

Questão 4:
Em mamíferos, incluindo humanos, como ocorre a herança do DNA mitocondrial (mtDNA)?
a) A herança do mtDNA é igualitária, provindo tanto do óvulo quanto do espermatozoide.
b) A herança do mtDNA é predominantemente paterna, devido à maior quantidade de mitocôndrias no espermatozoide.
c) A herança do mtDNA é exclusivamente materna, pois as mitocôndrias do espermatozoide são geralmente degradadas ou não entram no óvulo.
d) A herança do mtDNA é aleatória, podendo vir de qualquer um dos genitores, dependendo do processo de fertilização.

------------------------------------------------------------------------------------------------------------------------------------------------
Gabarito:
1.  b
2.  c
3.  c
4.  c`;
    return prompt;
}
