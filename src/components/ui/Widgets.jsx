import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for merging classes
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Base Glass Card
export const Card = ({ children, className, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={cn(
                "bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm rounded-2xl overflow-hidden",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

// Bento Grid Layout
export const BentoGrid = ({ children, className }) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4", className)}>
            {children}
        </div>
    );
};

// Bento Grid Item
export const BentoItem = ({ children, className, colSpan = 1, rowSpan = 1 }) => {
    const colClass = {
        1: 'md:col-span-1',
        2: 'md:col-span-2',
        3: 'md:col-span-3',
        4: 'md:col-span-4',
    }[colSpan] || 'md:col-span-1';

    const rowClass = {
        1: 'md:row-span-1',
        2: 'md:row-span-2',
    }[rowSpan] || 'md:row-span-1';

    return (
        <div className={cn(colClass, rowClass, "h-full", className)}>
            {children}
        </div>
    );
};

// Stat Card
export const StatCard = ({ title, value, icon: Icon, trend, trendUp, description }) => {
    return (
        <Card className="p-6 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                </div>
                {Icon && (
                    <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                        <Icon size={24} />
                    </div>
                )}
            </div>

            {(trend || description) && (
                <div className="flex items-center text-sm">
                    {trend && (
                        <span className={cn(
                            "font-semibold mr-2 px-2 py-0.5 rounded-full text-xs",
                            trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                            {trend}
                        </span>
                    )}
                    {description && <span className="text-slate-400">{description}</span>}
                </div>
            )}
        </Card>
    );
};

// Badge
export const Badge = ({ children, variant = 'default', className }) => {
    const variants = {
        default: 'bg-slate-100 text-slate-700',
        success: 'bg-green-100 text-green-700',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
        teal: 'bg-teal-100 text-teal-700',
    };

    return (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}>
            {children}
        </span>
    );
};

// Button
export const Button = ({ children, variant = 'primary', className, ...props }) => {
    const variants = {
        primary: 'bg-teal-500 hover:bg-teal-600 text-white shadow-lg shadow-teal-500/30',
        secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
        ghost: 'hover:bg-slate-100 text-slate-600',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30',
    };

    return (
        <button
            className={cn(
                "px-4 py-2 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
};
