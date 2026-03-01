document.addEventListener('DOMContentLoaded', () => {
    // Initial Icons
    if (window.lucide) lucide.createIcons();

    // Scenario Data
    const SCENARIOS = {
        approve: {
            label: "Authorized Protocol",
            desc: "Procurement workflow within defined thresholds.",
            icon: "check",
            resultText: "Execute",
            resultClass: "result-success", // Maps to white styling
            log: {
                id: "AX-7721-001",
                status: "APPROVED",
                policy: "procurement_v4.1",
                integrity_hash: "0x8f2...a1c",
                timestamp: "2025-01-15T14:32:18Z",
                rationale: "All compliance markers validated."
            }
        },
        block: {
            label: "Policy Violation",
            desc: "Conflict detected: equity holding in vendor.",
            icon: "x",
            resultText: "Block",
            resultClass: "result-block", // Maps to dark/red styling
            log: {
                id: "AX-7721-002",
                status: "TERMINATED",
                policy: "ethics_v2.0",
                integrity_hash: "0x9d1...f4e",
                timestamp: "2025-01-15T14:34:02Z",
                rationale: "Conflict of interest detected in evaluator profile."
            }
        },
        escalate: {
            label: "Manual Intervention",
            desc: "Contract value exceeds automated limits.",
            icon: "alert-circle",
            resultText: "Review",
            resultClass: "result-warn",
            log: {
                id: "AX-7721-003",
                status: "ESCALATED",
                policy: "fiscal_v1.2",
                integrity_hash: "0x1b4...e5d",
                timestamp: "2025-01-15T14:38:45Z",
                rationale: "Requires human-in-the-loop review (> $5.0M)."
            }
        }
    };

    let currentScenario = null;
    let stage = 0;

    // Reset initially
    resetFlow();

    // Event Listeners
    document.querySelectorAll('.infra-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const scenarioType = this.getAttribute('data-scenario');
            if (scenarioType === currentScenario && stage < 4 && stage > 0) return; // Prevent double click during run
            runScenario(scenarioType);
        });
    });

    function runScenario(type) {
        resetFlow();
        
        // Update Button States
        document.querySelectorAll('.infra-btn').forEach(btn => {
            const isTarget = btn.getAttribute('data-scenario') === type;
            btn.classList.toggle('active', isTarget);
        });

        currentScenario = type;
        
        // Timing sequence
        setTimeout(() => setStage(1), 100);
        setTimeout(() => setStage(2), 900);
        setTimeout(() => setStage(3), 1700);
        setTimeout(() => setStage(4), 2500);
    }

    function resetFlow() {
        stage = 0;
        
        // Reset Nodes 1-3
        for (let i = 1; i <= 3; i++) {
            const nodeCircle = document.getElementById(`node-${i}`);
            const nodeWrapper = nodeCircle.parentElement;
            
            nodeCircle.className = 'node-circle';
            // Reset Icon color
            nodeCircle.querySelector('.node-icon').style.color = ''; // reset to CSS default
            
            // Reset Text Labels
            const label = document.getElementById(`node-${i}-label`);
            nodeWrapper.classList.remove('active');
            
            // Reset Connectors
            document.getElementById(`conn-${i}`).style.width = '0%';
        }
        
        // Reset Result Node
        const resultNode = document.getElementById('result-node');
        resultNode.className = 'node-circle result-waiting';
        resultNode.innerHTML = '<div class="ping-dot"></div>';
        
        const resultLabel = document.getElementById('result-label');
        resultLabel.textContent = 'Awaiting';
        resultLabel.style.color = ''; // reset

        // Reset Audit Log
        document.getElementById('audit-content').innerHTML = `
            <div class="skeleton-group">
                <div class="sk-line w-75"></div>
                <div class="sk-line w-50"></div>
                <div class="sk-line w-60"></div>
                <div class="sk-line w-25"></div>
            </div>
        `;
    }

    function setStage(newStage) {
        stage = newStage;

        if (stage >= 1 && stage <= 3) {
            const nodeCircle = document.getElementById(`node-${stage}`);
            const nodeWrapper = nodeCircle.parentElement;
            
            // Activate current node
            nodeCircle.classList.add('active');
            nodeWrapper.classList.add('active');
            
            // Mark previous as completed
            for (let i = 1; i < stage; i++) {
                const prevNode = document.getElementById(`node-${i}`);
                prevNode.classList.remove('active');
                prevNode.classList.add('completed');
                
                // Reset label color for completed
                prevNode.parentElement.classList.remove('active');
            }

            // Animate connector
            if (stage <= 3) {
                document.getElementById(`conn-${stage}`).style.width = '100%';
            }
        }

        if (stage === 4) {
            // Complete Node 3
            const node3 = document.getElementById('node-3');
            node3.classList.remove('active');
            node3.classList.add('completed');
            node3.parentElement.classList.remove('active');

            // Show Result
            const scenario = SCENARIOS[currentScenario];
            const resultNode = document.getElementById('result-node');
            
            resultNode.className = `node-circle ${scenario.resultClass}`;
            resultNode.innerHTML = `<i data-lucide="${scenario.icon}" class="node-icon" style="color: inherit;"></i>`;
            
            const resultLabel = document.getElementById('result-label');
            resultLabel.textContent = scenario.resultText;
            resultLabel.style.color = 'white';

            if (window.lucide) lucide.createIcons();
            
            // Show Log
            showAuditLog(scenario.log);
        }
    }

    function showAuditLog(log) {
        const auditContent = document.getElementById('audit-content');
        let html = '<div class="log-grid-v2">';
        
        for (const [key, value] of Object.entries(log)) {
            html += `
                <div class="log-row">
                    <span class="log-label">${key.replace('_', ' ')}</span>
                    <span class="log-data ${key === 'status' ? 'highlight' : ''}">${value}</span>
                </div>
            `;
        }
        
        html += '</div>';
        auditContent.innerHTML = html;
    }
});