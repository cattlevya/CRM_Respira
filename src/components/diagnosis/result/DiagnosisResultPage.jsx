import React from 'react';
import DiagnosisHeaderCard from './DiagnosisHeaderCard';
import ClinicalAnalysis from './ClinicalAnalysis';
import ActionPlanSidebar from './ActionPlanSidebar';

const DiagnosisResultPage = ({ diagnosis, severity, confidence, recommendation, saveStatus, onRestart }) => {
    return (
        <div className="space-y-8">
            {/* Top Header Card */}
            <DiagnosisHeaderCard
                diagnosis={diagnosis}
                severity={severity}
                confidence={confidence}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-0 md:px-2">

                {/* Left Column: Analysis (9/12) */}
                <div className="lg:col-span-9">
                    <ClinicalAnalysis
                        diagnosis={diagnosis}
                        recommendation={recommendation}
                        saveStatus={saveStatus}
                        onRestart={onRestart}
                    />
                </div>

                {/* Right Column: Action Plan (3/12) */}
                <div className="lg:col-span-3">
                    <ActionPlanSidebar severity={severity} />
                </div>
            </div>
        </div>
    );
};

export default DiagnosisResultPage;
