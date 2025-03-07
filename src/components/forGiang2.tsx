"use client";

import React, { useEffect, useState } from 'react';

const WomensDay: React.FC = () => {
    // Các hook luôn được gọi bất kể mounted hay không
    const [mounted, setMounted] = useState(false);
    const confettiPieces = Array.from({ length: 50 });

    const getRandomColor = () => {
        const colors = ['#FFC0CB', '#FFD700', '#ADFF2F', '#FF69B4', '#87CEFA', '#FF4500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Mảng chứa các dòng nội dung cần hiển thị theo hiệu ứng gõ chữ.
    const textLines = [
        "Không biết có được là người chúc em sớm nhất hông ...",
        "Nhưng mà bây giờ, 1h sáng rùiiii",
        "Chúc em có một ngày thật vui vẻ, hạnh phúc và ấm áp nè",
        "Dù có gặp khó khăn, thất bại hay gì chăng nữa, hãy nhớ rằng:",
        "Anh vẫn ở đây ...",
        "Đợi em",
        "Đồng ý",
        "14/3 này đi chơi với anh nha"
    ];
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState<string>('');
    const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
    const [charIndex, setCharIndex] = useState<number>(0);

    // State cho vị trí của nút "không".
    // Ban đầu đặt cách tâm 80px về bên phải (và top = 0).
    const [noButtonPos, setNoButtonPos] = useState<{ top: number; left: number }>({ top: 0, left: 80 });

    // Đánh dấu khi component được mount
    useEffect(() => {
        setMounted(true);
    }, []);

    // Hiệu ứng gõ chữ chỉ chạy sau khi đã mount
    useEffect(() => {
        if (!mounted) return;

        if (currentLineIndex < textLines.length) {
            if (charIndex < textLines[currentLineIndex].length) {
                const timeout = setTimeout(() => {
                    setCurrentLine(textLines[currentLineIndex].substring(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                }, 100); // tốc độ gõ chữ (ms)
                return () => clearTimeout(timeout);
            } else {
                const timeout = setTimeout(() => {
                    setDisplayedLines(prev => [...prev, textLines[currentLineIndex]]);
                    setCurrentLineIndex(currentLineIndex + 1);
                    setCurrentLine('');
                    setCharIndex(0);
                }, 1000); // thời gian chờ giữa các dòng (ms)
                return () => clearTimeout(timeout);
            }
        }
    }, [mounted, charIndex, currentLineIndex, textLines]);

    // Xử lý khi nhấn nút "có"
    const handleYesClick = () => {
        alert('Ừm... anh không biết em có ấn hay không, tại anh không kịp làm thêm gì nữa, mama giục anh ngủ rùi :< nhắn cho anh nha');
    };

    // Khi hover vào nút "không": thay đổi vị trí của nút, với offset ngẫu nhiên rộng hơn
    const handleNoHover = () => {
        // Cập nhật phạm vi di chuyển: horizontal từ -200 đến 200, vertical từ -100 đến 100.
        const randomOffsetX = Math.floor(Math.random() * 401) - 200; // từ -200 đến 200
        const randomOffsetY = Math.floor(Math.random() * 201) - 100;   // từ -100 đến 100
        setNoButtonPos({ top: randomOffsetY, left: 80 + randomOffsetX });
    };

    return (
        <div className="container">
            {!mounted ? null : (
                <>
                    <h1 className="animated-text">Chúc mừng ngày 8/3!</h1>
                    <p className="subtext">Muốn gửi một bông hoa đến bông hoa đẹp nhất đang đọc cơ 🥺🥺🥺</p>

                    <div className="typing-container">
                        {displayedLines.map((line, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: line }} />
                        ))}
                        {currentLineIndex < textLines.length && (
                            <p>
                                <span dangerouslySetInnerHTML={{ __html: currentLine }} />
                                <span className="cursor">|</span>
                            </p>
                        )}
                    </div>

                    {/* Hiển thị nút sau khi tất cả các dòng chữ đã được gõ */}
                    {currentLineIndex >= textLines.length && (
                        <div className="button-group">
                            <button
                                className="yes-button"
                                onClick={handleYesClick}
                                style={{
                                    position: 'absolute',
                                    top: '0px',
                                    left: 'calc(50% - 80px)',
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                Dạạạạạạ
                            </button>
                            <button
                                className="no-button"
                                onMouseEnter={handleNoHover}
                                style={{
                                    position: 'absolute',
                                    top: `${noButtonPos.top}px`,
                                    left: `calc(50% + ${noButtonPos.left}px)`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                KHÔNG !!!
                            </button>
                        </div>
                    )}

                    <div className="confetti-container">
                        {confettiPieces.map((_, i) => (
                            <div
                                key={i}
                                className="confetti-piece"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    backgroundColor: getRandomColor(),
                                }}
                            />
                        ))}
                    </div>
                </>
            )}

            <style>{`
        .container {
          position: relative;
          text-align: center;
          padding: 50px;
          background: linear-gradient(to right, #ff9a9e, #fad0c4);
          overflow: hidden;
          min-height: 100vh;
        }
        .animated-text {
          font-size: 3rem;
          color: #fff;
          animation: bounce 2s infinite;
          margin-bottom: 20px;
        }
        .subtext {
          font-size: 1.5rem;
          color: #fff;
          margin-bottom: 40px;
        }
        .typing-container {
          font-family: 'Courier New', Courier, monospace;
          font-size: 1.2rem;
          line-height: 1.8;
          color: #fff;
          margin-bottom: 40px;
        }
        .cursor {
          display: inline-block;
          margin-left: 2px;
          animation: blink 1s step-end infinite;
        }
        @keyframes blink {
          from, to { opacity: 0; }
          50% { opacity: 1; }
        }
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          animation: fall 5s linear infinite;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes fall {
          0% {
            transform: translateY(-10%);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh);
            opacity: 0;
          }
        }
        .button-group {
          position: relative;
          width: 100%;
          height: 100px;
          margin-top: 20px;
        }
        .button-group .yes-button,
        .button-group .no-button {
          font-size: 1.2rem;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
        }
        .button-group .yes-button {
          background-color: #28a745;
          color: white;
        }
        .button-group .no-button {
          background-color: #dc3545;
          color: white;
        }
        .button-group .yes-button:hover,
        .button-group .no-button:hover {
          transform: scale(1.1);
        }
      `}</style>
        </div>
    );
};

export default WomensDay;
