import React from 'react';

function AnswerDisplay({ question, answer }) {
  if (!answer) return null;

  const getQuestionTypeEmoji = (type) => {
    const emojiMap = {
      'introduction': '👋',
      'behavioral': '📖',
      'technical': '💻',
      'motivation': '🎯',
      'self-assessment': '🔍',
      'general': '💬'
    };
    return emojiMap[type] || '💬';
  };

  return (
    <div className="answer-section">
      <h3>
        {getQuestionTypeEmoji(answer.questionType)} Your Answer
        <span style={{
          fontSize: '0.85rem',
          color: '#6b7280',
          fontWeight: 'normal',
          marginLeft: '10px'
        }}>
          ({answer.questionType})
        </span>
      </h3>

      <div className="answer-text">
        <p>{answer.answer}</p>
      </div>

      {answer.usedContext && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: 'white',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <strong>Context Used:</strong>
          <div style={{ marginTop: '8px', color: '#6b7280' }}>
            {answer.usedContext.hasResume && (
              <span style={{ marginRight: '15px' }}>✓ Resume data</span>
            )}
            {answer.usedContext.hasJobDescription && (
              <span>✓ Job description</span>
            )}
            {!answer.usedContext.hasResume && !answer.usedContext.hasJobDescription && (
              <span>General answer (no context)</span>
            )}
          </div>
        </div>
      )}

      <div style={{
        marginTop: '20px',
        padding: '15px',
        background: '#fef3c7',
        borderRadius: '8px',
        borderLeft: '4px solid #f59e0b'
      }}>
        <p style={{ fontSize: '0.9rem', color: '#92400e' }}>
          <strong>💡 Practice Tip:</strong> Read this answer out loud to practice your delivery.
          Adjust the wording to match your natural speaking style.
        </p>
      </div>
    </div>
  );
}

export default AnswerDisplay;
