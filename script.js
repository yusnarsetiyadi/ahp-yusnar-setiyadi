function start() {
    const inputCriteriaContainer = document.getElementById("inputCriteriaContainer");
    inputCriteriaContainer.classList.remove("hidden");
}

// Generate Pairwise Comparison Matrix
function generatePairwise() {
    const criteriaInput = document.getElementById("criteria").value.trim();
    const criteria = criteriaInput.split(",").map(c => c.trim());
    const pairwiseContainer = document.getElementById("pairwiseContainer");
    const pairwiseTable = document.getElementById("pairwiseTable").querySelector("tbody");
    pairwiseTable.innerHTML = ""; // Reset table

    if (criteria.length < 2) {
        alert("Masukkan minimal dua kriteria.");
        return;
    }

    // Generate rows for pairwise comparison
    for (let i = 0; i < criteria.length; i++) {
        for (let j = i + 1; j < criteria.length; j++) {
            const row = document.createElement("tr");

            const cell1 = document.createElement("td");
            cell1.textContent = criteria[i];

            const cell2 = document.createElement("td");
            cell2.textContent = criteria[j];

            const cell3 = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.step = "0.1";
            input.min = "0.1";
            input.value = "1";
            input.setAttribute("data-criteria", `${criteria[i]}-${criteria[j]}`);
            cell3.appendChild(input);

            row.appendChild(cell1);
            row.appendChild(cell2);
            row.appendChild(cell3);

            pairwiseTable.appendChild(row);
        }
    }

    pairwiseContainer.classList.remove("hidden");
}

// Calculate Weights
function calculateWeights() {
    const criteriaInput = document.getElementById("criteria").value.trim();
    const criteria = criteriaInput.split(",").map(c => c.trim());
    const pairwiseInputs = document.querySelectorAll("#pairwiseTable input");
    const inputAlternativeContainer = document.getElementById("inputAlternativeContainer");

    // Create pairwise matrix
    const matrix = Array(criteria.length).fill(0).map(() => Array(criteria.length).fill(1));
    pairwiseInputs.forEach(input => {
        const [crit1, crit2] = input.getAttribute("data-criteria").split("-");
        const i = criteria.indexOf(crit1);
        const j = criteria.indexOf(crit2);
        const value = parseFloat(input.value);

        matrix[i][j] = value;
        matrix[j][i] = 1 / value;
    });

    // Calculate normalized matrix
    const columnSums = matrix[0].map((_, colIndex) => matrix.reduce((sum, row) => sum + row[colIndex], 0));
    const normalizedMatrix = matrix.map(row => row.map((value, colIndex) => value / columnSums[colIndex]));

    // Calculate weights
    const weights = normalizedMatrix.map(row => row.reduce((sum, value) => sum + value, 0) / criteria.length);

    // Consistency check
    const weightedSum = matrix.map((row, i) => row.reduce((sum, value, j) => sum + value * weights[j], 0));
    const consistencyIndex = (weightedSum.reduce((sum, value, i) => sum + value / weights[i], 0) / criteria.length - criteria.length) / (criteria.length - 1);
    const randomIndex = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49][criteria.length] || 1.45;
    const consistencyRatio = consistencyIndex / randomIndex;

    // Display results
    const resultsTable = document.getElementById("resultsTable").querySelector("tbody");
    resultsTable.innerHTML = ""; // Reset table

    criteria.forEach((crit, i) => {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.textContent = crit;

        const cell2 = document.createElement("td");
        cell2.textContent = weights[i].toFixed(4);

        row.appendChild(cell1);
        row.appendChild(cell2);

        resultsTable.appendChild(row);
    });

    document.getElementById("consistencyRatio").textContent =
        `Consistency Ratio: ${consistencyRatio.toFixed(4)} (${consistencyRatio <= 0.1 ? "Konsisten" : "Tidak Konsisten"})`;
    document.getElementById("results").classList.remove("hidden");

    inputAlternativeContainer.classList.remove("hidden");
}

// Generate Pairwise Comparison for Alternatives
function generateAlternativeComparisons() {
    const alternativesInput = document.getElementById("alternatives").value.trim();
    const criteriaInput = document.getElementById("criteria").value.trim();
    const criteria = criteriaInput.split(",").map(c => c.trim());
    const alternatives = alternativesInput.split(",").map(a => a.trim());
    const alternativeContainer = document.getElementById("alternativeContainer");
    const alternativeTables = document.getElementById("alternativeTables");

    alternativeTables.innerHTML = ""; // Reset container

    if (alternatives.length < 2) {
        alert("Masukkan minimal dua alternatif.");
        return;
    }

    // Generate pairwise tables for each criterion
    criteria.forEach(criterion => {
        const tableContainer = document.createElement("div");
        tableContainer.classList.add("criterion-table");

        const heading = document.createElement("h3");
        heading.textContent = `Perbandingan Alternatif untuk Kriteria: ${criterion}`;
        tableContainer.appendChild(heading);

        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Alternatif</th>
                    <th>vs</th>
                    <th>Nilai (Skala Saaty)</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;

        const tbody = table.querySelector("tbody");
        for (let i = 0; i < alternatives.length; i++) {
            for (let j = i + 1; j < alternatives.length; j++) {
                const row = document.createElement("tr");

                const cell1 = document.createElement("td");
                cell1.textContent = alternatives[i];

                const cell2 = document.createElement("td");
                cell2.textContent = alternatives[j];

                const cell3 = document.createElement("td");
                const input = document.createElement("input");
                input.type = "number";
                input.step = "0.1";
                input.min = "0.1";
                input.value = "1";
                input.setAttribute("data-criterion", criterion);
                input.setAttribute("data-alternatives", `${alternatives[i]}-${alternatives[j]}`);
                cell3.appendChild(input);

                row.appendChild(cell1);
                row.appendChild(cell2);
                row.appendChild(cell3);

                tbody.appendChild(row);
            }
        }

        tableContainer.appendChild(table);
        alternativeTables.appendChild(tableContainer);
    });

    alternativeContainer.classList.remove("hidden");
}

// Calculate Final Scores for Alternatives
function calculateFinalScores() {
    const alternativesInput = document.getElementById("alternatives").value.trim();
    const criteriaInput = document.getElementById("criteria").value.trim();
    const criteria = criteriaInput.split(",").map(c => c.trim());
    const alternatives = alternativesInput.split(",").map(a => a.trim());
    const pairwiseInputs = document.querySelectorAll("#alternativeTables input");

    const weights = {}; // Store weights for each criterion
    criteria.forEach((criterion, index) => {
        weights[criterion] = document.getElementById("resultsTable").querySelectorAll("td:nth-child(2)")[index].textContent;
    });

    const alternativeScores = {}; // Store final scores for each alternative
    alternatives.forEach(alternative => alternativeScores[alternative] = 0);

    criteria.forEach(criterion => {
        // Create pairwise matrix for alternatives under this criterion
        const matrix = Array(alternatives.length).fill(0).map(() => Array(alternatives.length).fill(1));
        pairwiseInputs.forEach(input => {
            if (input.getAttribute("data-criterion") === criterion) {
                const [alt1, alt2] = input.getAttribute("data-alternatives").split("-");
                const i = alternatives.indexOf(alt1);
                const j = alternatives.indexOf(alt2);
                const value = parseFloat(input.value);

                matrix[i][j] = value;
                matrix[j][i] = 1 / value;
            }
        });

        // Calculate weights for alternatives under this criterion
        const columnSums = matrix[0].map((_, colIndex) => matrix.reduce((sum, row) => sum + row[colIndex], 0));
        const normalizedMatrix = matrix.map(row => row.map((value, colIndex) => value / columnSums[colIndex]));
        const localWeights = normalizedMatrix.map(row => row.reduce((sum, value) => sum + value, 0) / alternatives.length);

        // Add to final scores weighted by criterion weight
        localWeights.forEach((weight, i) => {
            alternativeScores[alternatives[i]] += weight * weights[criterion];
        });
    });

    // Display final results
    const finalResultsTable = document.getElementById("finalResultsTable").querySelector("tbody");
    finalResultsTable.innerHTML = ""; // Reset table

    Object.entries(alternativeScores).forEach(([alternative, score]) => {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        cell1.textContent = alternative;

        const cell2 = document.createElement("td");
        cell2.textContent = score.toFixed(4);

        row.appendChild(cell1);
        row.appendChild(cell2);

        finalResultsTable.appendChild(row);
    });

    document.getElementById("finalResults").classList.remove("hidden");
}

function download() {
    window.print();
}