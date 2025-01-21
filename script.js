// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyBZDQCt9JsiTWPIfupuTx-soL4P8queAbE",
    authDomain: "qna1-27186.firebaseapp.com",
    projectId: "qna1-27186",
    storageBucket: "qna1-27186.firebasestorage.app",
    messagingSenderId: "406324964352",
    appId: "1:406324964352:web:893b762650b83e452e3ce5",
    measurementId: "G-WTL0ZKVBXC"
};

// Firebase 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 질문 데이터를 저장할 배열
let questions = [];

// 질문 제출 함수
async function submitQuestion() {
    const subject = document.getElementById('subject').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    if (!subject || !title || !content) {
        alert('모든 필드를 입력해주세요!');
        return;
    }

    try {
        const questionData = {
            subject: subject,
            title: title,
            content: content,
            answers: [],
            date: new Date().toLocaleDateString(),
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        // 콘솔에 데이터 출력하여 확인
        console.log('Submitting question:', questionData);

        // Firestore에 데이터 추가
        const docRef = await db.collection('questions').add(questionData);
        console.log('Document written with ID: ', docRef.id);

        clearForm();
        alert('질문이 성공적으로 등록되었습니다!');
    } catch (error) {
        console.error("Error adding question:", error);
        alert('질문 등록에 실패했습니다: ' + error.message);
    }
}

// 답변 제출 함수
async function submitAnswer(questionId) {
    const answerInput = document.getElementById(`answer-${questionId}`);
    const answerText = answerInput.value;

    if (!answerText) {
        alert('답변을 입력해주세요!');
        return;
    }

    try {
        const questionRef = db.collection('questions').doc(questionId);
        
        await questionRef.update({
            answers: firebase.firestore.FieldValue.arrayUnion({
                content: answerText,
                date: new Date().toLocaleDateString(),
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        });

        answerInput.value = '';
        alert('답변이 등록되었습니다!');
    } catch (error) {
        console.error("Error adding answer:", error);
        alert('답변 등록에 실패했습니다: ' + error.message);
    }
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
                <h4>💬 답변 (${question.answers ? question.answers.length : 0}개)</h4>
                ${question.answers ? question.answers.map(answer => `
                    <div class="answer">
                        <p>${answer.content}</p>
                        <small>📅 ${answer.date}</small>
                    </div>
                `).join('') : ''}
                <div class="answer-form">
                    <input type="text" id="answer-${question.id}" 
                           class="answer-input" 
                           placeholder="답변을 입력하세요">
                    <button onclick="submitAnswer('${question.id}')" 
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

// 실시간 업데이트 설정
function setupRealtimeUpdates() {
    db.collection('questions')
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
            questions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            updateQuestionsList();
        }, (error) => {
            console.error("Realtime update error:", error);
        });
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    setupRealtimeUpdates();
});
