// Variáveis globais de estado
let currentQuestionIndex = 0;
let userAnswers = []; // Armazena o índice da opção escolhida pelo usuário para cada questão
let userName = '';
let selectedOptionIndex = null;
let chartInstance = null;

// Dados do Quiz: Mínimo de 15 questões de Múltipla Escolha
const questions = [
    {
        question: "Qual tag HTML é usada para incluir estilos CSS diretamente na head do documento?",
        options: ["<link>", "<style>", "<css>", "<script>"],
        correctAnswer: 1 // <style>
    },
    {
        question: "Em CSS, qual seletor é usado para selecionar um elemento com base no seu ID?",
        options: [". (ponto)", "# (cerquilha)", "* (asterisco)", ": (dois pontos)"],
        correctAnswer: 1 // # (cerquilha)
    },
    {
        question: "Qual palavra-chave JavaScript é usada para declarar uma variável cujo valor não pode ser reatribuído?",
        options: ["var", "let", "const", "static"],
        correctAnswer: 2 // const
    },
    {
        question: "Qual elemento é considerado o elemento raiz de um documento HTML?",
        options: ["<head>", "<body>", "<html>", "<title>"],
        correctAnswer: 2 // <html>
    },
    {
        question: "Qual propriedade CSS é usada para alterar a cor do texto de um elemento?",
        options: ["background-color", "text-color", "color", "font-color"],
        correctAnswer: 2 // color
    },
    {
        question: "Qual função JavaScript é usada para gerar um número aleatório entre 0 (inclusivo) e 1 (exclusivo)?",
        options: ["Math.random()", "Math.int()", "Math.floor()", "Math.ceil()"],
        correctAnswer: 0 // Math.random()
    },
    {
        question: "No Box Model do CSS, qual propriedade define o espaço entre o conteúdo do elemento e sua borda?",
        options: ["margin", "padding", "border-spacing", "outline"],
        correctAnswer: 1 // padding
    },
    {
        question: "Qual tag HTML é semanticamente correta para agrupar o conteúdo de navegação de um site?",
        options: ["<sections>", "<menu>", "<nav>", "<footer>"],
        correctAnswer: 2 
    },
    {
        question: "Em JavaScript, o que o operador '===' verifica?",
        options: ["Igualdade de valor apenas", "Igualdade de tipo apenas", "Igualdade de valor e tipo", "Atribuição de valor"],
        correctAnswer: 2 // Igualdade de valor e tipo 
    },
    {
        question: "Para que serve a propriedade 'display: flex;' no CSS?",
        options: ["Tornar um elemento inline", "Criar um layout de grade (grid)", "Ativar o Flexbox para alinhamento de itens", "Ocultar um elemento"],
        correctAnswer: 2 // Ativar o Flexbox para alinhamento de itens
    },
    {
        question: "Qual é o nome do mecanismo assíncrono padrão do JavaScript usado para lidar com operações futuras (como requisições HTTP)?",
        options: ["Callback", "Event Loop", "Promise", "Thread"],
        correctAnswer: 2 
    },
    {
        question: "Qual atributo HTML deve ser usado para abrir um link em uma nova aba do navegador?",
        options: ["target='_self'", "target='_top'", "target='_parent'", "target='_blank'"],
        correctAnswer: 3 
    },
    {
        question: "Qual unidade de medida CSS é relativa à altura da viewport?",
        options: ["vw", "em", "rem", "vh"],
        correctAnswer: 3 
    },
    {
        question: "Qual método de array JavaScript é usado para adicionar um ou mais elementos ao *final* de um array e retornar o novo comprimento?",
        options: ["shift()", "unshift()", "pop()", "push()"],
        correctAnswer: 3 // push()
    },
    {
        question: "Qual é a sintaxe correta para um comentário de uma única linha em JavaScript?",
        options: ["<!-- Comentário -->", "// Comentário", "/* Comentário */", "# Comentário"],
        correctAnswer: 1 
    },
    {
        question: "Qual termo é usado para descrever o processo de converter um objeto JavaScript em uma string JSON?",
        options: ["JSON.parse()", "JSON.stringify()", "Object.serialize()", "String.convert()"],
        correctAnswer: 1 
    }
];

// Funções principais
/**
 * Inicia o Quiz, armazena o nome e troca a tela.
 */
function startQuiz() {
    const userNameInput = document.getElementById('userName');
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');

    userName = userNameInput.value.trim();
    if (userName === '') {
        console.error('Nome do usuário não preenchido.');
        return;
    }
    
    // Inicializa o estado
    currentQuestionIndex = 0;
    userAnswers = Array(questions.length).fill(null);
    selectedOptionIndex = null;

    // Altera a visualização da tela
    startScreen.classList.add('hidden');
    quizScreen.classList.remove('hidden');

    // Renderiza a primeira questão
    renderQuestion();
}

/**
 * Renderiza a questão atual na tela.
 */
function renderQuestion() {
    
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }
    
    const q = questions[currentQuestionIndex];
    const progressText = document.getElementById('progress-text');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('nextButton');
    
    // Atualiza o texto de progresso
    progressText.textContent = `Questão ${currentQuestionIndex + 1} de ${questions.length}`;

    // Atualiza o texto da pergunta
    questionText.textContent = q.question;
    
    // Limpa o container de opções
    optionsContainer.innerHTML = '';
    
    // Reabilita e reseta o botão 'Avançar'
    nextButton.disabled = true;
    nextButton.classList.add('button-disabled');
    nextButton.classList.remove('button-enabled');
    nextButton.textContent = 'Avançar (Selecione uma opção)';
    selectedOptionIndex = null; // Reseta a opção selecionada

    // Cria os botões de opção
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.dataset.index = index;
        // Usa a classe semântica para os botões de opção
        button.className = 'option-button';
        
        // Adiciona o listener para seleção
        button.addEventListener('click', (event) => selectOption(index, event.target));
        
        optionsContainer.appendChild(button);
    });
}

/**
 * Processa a seleção da opção pelo usuário.
 * @param {number} index - O índice da opção selecionada.
 * @param {HTMLElement} selectedButton - O botão HTML selecionado.
 */
function selectOption(index, selectedButton) {
    const optionsContainer = document.getElementById('options-container');
    const nextButton = document.getElementById('nextButton');
    
    // Remove a classe 'selected-option' de todos os botões
    optionsContainer.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('selected-option');
    });

    // Adiciona a classe 'selected-option' ao botão clicado
    selectedButton.classList.add('selected-option');
    
    // Armazena o índice da opção selecionada para esta questão
    selectedOptionIndex = index;
    
    // Habilita o botão 'Avançar' usando as classes semânticas
    nextButton.disabled = false;
    nextButton.classList.remove('button-disabled');
    nextButton.classList.add('button-enabled');
    nextButton.textContent = 'Avançar para a próxima questão';
}

/**
 * Avança para a próxima questão, salvando a resposta atual.
 */
function nextQuestion() {
    if (selectedOptionIndex === null) {
        return; // Não permite avançar sem seleção
    }

    // Armazena a resposta do usuário
    userAnswers[currentQuestionIndex] = selectedOptionIndex;
    
    // Avança o índice da questão
    currentQuestionIndex++;
    
    // Renderiza a próxima questão ou exibe os resultados
    renderQuestion();
}

/**
 * Exibe a tela de resultados, calcula o score e renderiza o gráfico.
 */
function showResults() {
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');
    const totalQuestions = questions.length;
    let correctCount = 0;
    
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');

    // 1. Correção Automática: Calcular acertos e erros
    questions.forEach((q, index) => {
        if (userAnswers[index] === q.correctAnswer) {
            correctCount++;
        }
    });

    const errorCount = totalQuestions - correctCount;
    const successPercentage = (correctCount / totalQuestions) * 100;

    // 2. Exibir Informações e Atribuir Resultado ao Nome
    document.getElementById('user-info').innerHTML = `
        Parabéns, <span class="font-extrabold text-blue-800">${userName}</span>! Aqui está o seu desempenho final.
    `;
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('error-count').textContent = errorCount;
    document.getElementById('percentage').textContent = `${successPercentage.toFixed(1)}%`;

    // 3. Mensagem de Desempenho
    const messageElement = document.getElementById('performance-message');
    let message = '';
    let bgColorClass = '';

    if (successPercentage >= 80) {
        message = "Excelente!";
        bgColorClass = 'performance-excellent';
    } else if (successPercentage >= 50 && successPercentage < 80) {
        message = "Bom desempenho";
        bgColorClass = 'performance-good';
    } else { // < 50%
        message = "Precisa melhorar";
        bgColorClass = 'performance-poor';
    }

    messageElement.textContent = message;
    // Adiciona a classe de desempenho específica ao lado da classe base
    messageElement.className = `performance-message-base ${bgColorClass}`;
    
    // 4. Gráfico de Desempenho (Chart.js)
    renderChart(correctCount, errorCount);
}

/**
 * Gera o Gráfico de Pizza/Doughnut usando Chart.js
 * @param {number} correctCount - Número de acertos.
 * @param {number} errorCount - Número de erros.
 */
function renderChart(correctCount, errorCount) {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Destrói a instância anterior do gráfico se existir
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Cria o novo gráfico (Gráfico de Pizza/Doughnut)
    chartInstance = new Chart(ctx, {
        type: 'doughnut', // Gráfico de Pizza (ou 'bar' para barras)
        data: {
            labels: ['Acertos', 'Erros'],
            datasets: [{
                label: 'Desempenho',
                data: [correctCount, errorCount],
                backgroundColor: [
                    'rgb(16, 185, 129)', // emerald-500
                    'rgb(239, 68, 68)'   // red-500
                ],
                hoverOffset: 4,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            family: 'Inter',
                            size: 14
                        }
                    }
                },
                title: {
                    display: false
                }
            }
        }
    });
}


// Event Listeners (Registrados após o DOM carregar)
document.addEventListener('DOMContentLoaded', () => {
    const userNameInput = document.getElementById('userName');
    const startButton = document.getElementById('startButton');
    const nextButton = document.getElementById('nextButton');
    const restartButton = document.getElementById('restartButton');

    // 1. Habilita/Desabilita o botão 'Começar'
    userNameInput.addEventListener('input', () => {
        const isValid = userNameInput.value.trim() !== '';
        
        startButton.disabled = !isValid;
        if (isValid) {
            startButton.classList.remove('button-disabled');
            startButton.classList.add('button-enabled');
        } else {
            startButton.classList.remove('button-enabled');
            startButton.classList.add('button-disabled');
        }
    });

    // 2. Chama a função startQuiz ao clicar no botão Começar
    startButton.addEventListener('click', startQuiz);

    // 3. Chama a função nextQuestion ao clicar no botão Avançar
    nextButton.addEventListener('click', nextQuestion);
    
    // 4. Recarrega a página ao clicar no botão Recomeçar
    restartButton.addEventListener('click', () => {
        window.location.reload();
    });
});

