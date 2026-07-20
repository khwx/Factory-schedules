import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function BottomSheet({ isOpen, onClose, title, children, className }: BottomSheetProps) {
    const sheetRef = useRef<HTMLDivElement>(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        startY.current = e.touches[0].clientY;
        isDragging.current = true;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current) return;
        currentY.current = e.touches[0].clientY;
        const diff = currentY.current - startY.current;
        if (diff > 0 && sheetRef.current) {
            sheetRef.current.style.transform = `translateY(${diff}px)`;
        }
    }, []);

    const handleTouchEnd = useCallback(() => {
        isDragging.current = false;
        const diff = currentY.current - startY.current;
        if (diff > 100) {
            onClose();
        } else if (sheetRef.current) {
            sheetRef.current.style.transform = '';
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div
                ref={sheetRef}
                className={clsx(
                    'absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[85vh] overflow-hidden transition-transform duration-300',
                    className
                )}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div className="sticky top-0 bg-white z-10">
                    <div className="flex justify-center pt-2 pb-1">
                        <div className="w-10 h-1 rounded-full bg-gray-300" />
                    </div>
                    {title && (
                        <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">{title}</h3>
                            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="overflow-y-auto p-4 pb-8 max-h-[calc(85vh-60px)]">
                    {children}
                </div>
            </div>
        </div>
    );
}
