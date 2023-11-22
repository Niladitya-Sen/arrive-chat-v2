import { useCookies } from '@/hooks/useCookies';
import { cn } from '@/lib/utils'
import socket from '@/socket/socket'
import React, { useEffect, useRef, useState } from 'react';
import { AiTwotoneSound } from "react-icons/ai";

export default function ChatBubble({ message, role, time, type }: Readonly<{ message: string, role: "sender" | "system" | "captain", time?: string, type?: "choice" }>) {
    const cookies = useCookies();
    const [audioSrc, setAudioSrc] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setAudioSrc(`http://localhost:3013/node-api/get-speech/${message}?language=${cookies.getCookie('language')}`);
    }, [message]);

    return (
        <div
            className={cn("flex flex-row items-center gap-2", {
                'justify-center': role === 'system',
                'justify-end': role === 'sender',
                'justify-start': role === 'captain',
            })}
        >
            <div
                className={cn("relative isolate bg-white px-4 py-2 rounded-2xl flex flex-col gap-1 items-start max-w-[28rem]", {
                    'rounded-2xl text-black': role === 'system',
                    'rounded-br-none bg-primary text-white': role === 'sender',
                    'rounded-bl-none bg-[#f3dfc5] text-primary-foreground': role === 'captain',
                })}
            >
                <audio
                    src={audioSrc}
                    ref={audioRef}
                    autoPlay={false}
                />
                <p>{message}</p>
                <div className={cn('hidden flex-row gap-2 w-full', {
                    'flex': type === 'choice'
                })}>
                    <button
                        className='bg-white/60 rounded-md py-1 w-full min-w-[5rem] hover:bg-white/100 transition-colors'
                        onClick={() => {
                            const roomno = cookies.getCookie('roomno');
                            console.log(roomno);
                            if (roomno) {
                                socket.emit('join-room', { roomno });
                                socket.emit('send-message', { roomno, message: 'I want to book this service', messagedBy: 'customer' });
                                window.location.reload();
                            }
                        }}
                    >Yes</button>
                    <button className='bg-white/60 rounded-md py-1 w-full min-w-[5rem] hover:bg-white/100 transition-colors'>No</button>
                </div>
                <div
                    className={cn("text-xs self-end flex justify-between items-center w-full gap-2", {
                        'hidden': role === 'system',
                        'text-white/80': role === 'sender',
                        'text-black/80': role === 'captain',
                    })}
                >
                    <AiTwotoneSound onClick={() => {
                        audioRef.current?.play();
                    }} />
                    <p>{time}</p>
                </div>
            </div>
        </div>
    )
}