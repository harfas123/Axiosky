document.addEventListener('DOMContentLoaded', () => {
    // Initial Icons
    if (window.lucide) lucide.createIcons();

    // Scenario Data
   const SCENARIOS = {
        approve: {
            label: "Deterministic Match",
            resultLabel: "EXECUTE",
            icon: "check",
            log: {
                decision_id: "DEC-2025-8842",
                policy_hash: "sha256:7a8f3c2...",
                status: "APPROVE",
                rules_evaluated: ["risk_threshold_check", "conflict_scan_v4"],
                rationale: "Zero policy violations detected in agent context.",
                replay_token: "REPLAY_STABLE_991"
            }
        },
        block: {
            label: "Mandatory Deny",
            resultLabel: "DENY",
            icon: "x",
            log: {
                decision_id: "DEC-2025-8849",
                policy_hash: "sha256:7a8f3c2...",
                status: "BLOCK",
                rules_evaluated: ["sanctions_check", "aml_pattern_verify"],
                rationale: "Policy Violation: Restricted counterparty detected.",
                replay_token: "REPLAY_STABLE_992"
            }
        },
        escalate: {
            label: "Human Oversight",
            resultLabel: "ESCALATE",
            icon: "fingerprint",
            log: {
                decision_id: "DEC-2025-8901",
                policy_hash: "sha256:7a8f3c2...",
                status: "ESCALATE",
                rules_evaluated: ["anomaly_threshold", "manual_routing_rule"],
                rationale: "Contextual ambiguity: Value exceeds automated limit.",
                escalated_to: "compliance_officer_lvl2"
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
        const displayValue = Array.isArray(value) 
            ? value.join(', ') 
            : value;
            
        html += `
            <div class="log-row">
                <span class="log-label">${key.replace(/_/g, ' ')}</span>
                <span class="log-data ${key === 'status' ? 'highlight' : ''}">${displayValue}</span>
            </div>
        `;
    }
    
    html += '</div>';
    auditContent.innerHTML = html;
    }
});