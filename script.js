// 질문 데이터를 저장할 배열
let questions = JSON.parse(localStorage.getItem('questions')) || [];

// 질문 제출 함수
function submitQuestion() {
    const subject = document.getElementById('subject').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!subject || !title || !content) {
        alert('모든 필드를 입력해주세요!');
        return;
    }

    const question = {
        id: Date.now(),
        subject: subject,
        title: title,
        content: content,
        answers: [],
        date: new Date().toLocaleDateString()
    };

    questions.unshift(question);
    saveToLocalStorage();
    updateQuestionsList();
    clearForm();
}

// 답변 제출 함수
function submitAnswer(questionId) {
    const answerInput = document.getElementById(`answer-${questionId}`);
    const answerText = answerInput.value;

    if (!answerText) {
        alert('답변을 입력해주세요!');
        return;
    }

    const question = questions.find(q => q.id === questionId);
    if (question) {
        question.answers.push({
            content: answerText,
            date: new Date().toLocaleDateString()
        });
        saveToLocalStorage();
        updateQuestionsList();
    }
    answerInput.value = '';
}

// localStorage에 데이터 저장하는 함수
function saveToLocalStorage() {
    localStorage.setItem('questions', JSON.stringify(questions));
}

// 질문 목록 업데이트 함수
function updateQuestionsList() {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';

    questions.forEach(question => {
        const questionCard = document.createElement('div');
        questionCard.className = 'question-card';
        questionCard.innerHTML = `
            <div class="question-header">
                <span class="subject-tag">${getSubjectEmoji(question.subject)} ${question.subject}</span>
                <span>${question.date}</span>
            </div>
            <h3>${question.title}</h3>
            <p>${question.content}</p>
            <div class="answers">
                <h4>💬 답변 (${question.answers.length}개)</h4>
                ${question.answers.map(answer => `
                    <div class="answer">
                        <p>${answer.content}</p>
                        <small>📅 ${answer.date}</small>
                    </div>
                `).join('')}
                <div class="answer-form">
                    <input type="text" id="answer-${question.id}" 
                           class="answer-input" 
                           placeholder="답변을 입력하세요">
                    <button onclick="submitAnswer(${question.id})" 
                            class="submit-btn">답변 등록</button>
                </div>
            </div>
        `;
        questionsList.appendChild(questionCard);
    });
}

// 교과목 이모지 가져오기 함수
function getSubjectEmoji(subject) {
    const emojis = {
        '수학': '📐',
        '영어': '🔤',
        '과학': '🔬',
        '국어': '📖'
    };
    return emojis[subject] || '📚';
}

// 폼 초기화 함수
function clearForm() {
    document.getElementById('subject').value = '';
    document.getElementById('title').value = '';
    document.getElementById('content').value = '';
}

// 초기 질문 목록 렌더링
updateQuestionsList();
