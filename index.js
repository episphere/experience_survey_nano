async function callNano(text) {
    console.log(text)
    let temperature = 0.0
    let topK = 3
    let outputElement = document.getElementById("output")

    let systemPrompt = `
        You are an expert coder of open text surveys. Participants were asked, "Is there anything missing from our study communications that we should add?". You will be given a question response. Please only respond using the following JSON schema—no other response should be given:

        {
        "properties": {
            "category": {"type": "string"},
            "enum": [
            "Communication Frequency",
            "Communication Content",
            "Timeline Information",
            "Technical",
            "Scheduling",
            "Compensation",
            "Study Objectives & Progress",
            "Results",
            "None of the Above"
            ]
        }
        }

        Use the following descriptions of the categories to make your assignments: 

        - **Communication Frequency**: Refers to feedback about the frequency of communication.

        - **Communication Content**: Refers to feedback about the content of communication, including confusing messages and requests for general scientific information not directly pertaining to the study.

        - **Timeline Information**: Refers to feedback about specific deadlines, or the timing of study-related tasks or events.

        - **Technical**: Refers to feedback about technology (e.g., broken links, platform errors).

        - **Scheduling**: Feedback about aligning schedules or coordinating study participation.

        - **Compensation**: Feedback about payments, incentives, or rewards (including gift cards) for participation in the study.

        - **Study Objectives & Progress**: Feedback or questions about the purpose, goals, overall findings, or progress of the study.

        - **Results**: Feedback about the individual lab tests or findings derived from the study.

        - **None of the Above**: Refers to responses that do not fit into any of the predefined categories and may represent unrelated or ambiguous feedback.
        `;



    if ((await ai?.languageModel?.capabilities())?.available !== "readily") {
        outputElement.textContent =
            "Sorry! It seems like your browser does not have access to Gemini Nano. 😞";
        return;
    }

    const session = await ai.languageModel.create({
        temperature: temperature,
        topK: topK,
        systemPrompt: systemPrompt
    });

    let table = document.getElementById("output_table")
    let row = table.insertRow();
    let cell1 = row.insertCell();
    cell1.innerText = text;


    const res = await session.prompt(text);
    try {
        let x = JSON.parse(res)
        let cell2 = row.insertCell();
        cell2.innerText = x.properties.category;
    } catch (error) {
        console.error(error)
        let cell2 = row.insertCell();
        cell2.innerText = res;
    }

}



document.getElementById("run").addEventListener("click", async (event) => {
    let text = document.getElementById("responses").value.trim()
    if (text.length == 0) return

    text = text.split("\n")
    for (let response of text) {
        await callNano(response)
    }
})