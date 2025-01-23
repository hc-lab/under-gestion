import React from 'react';
import Card from './Card';

const StatCard = ({ title, value, icon, trend, status }) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                    {trend && (
                        <span className="text-green-500 text-sm">
                            {trend}
                        </span>
                    )}
                </div>
                <div className={`p-3 rounded-full ${
                    status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                    {icon}
                </div>
            </div>
        </Card>
    );
};

export default StatCard; 