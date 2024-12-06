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
            "Infrequent communication",
            "Timeline Information",
            "Technical or scheduling difficulties",
            "Compensation",
            "Study Objectives",
            "Results",
            "None of the Above"
            ]
        }
        }

        Use the following descriptions of the categories to make your assignments: 

        - **Infrequent Communication**: Refers to feedback indicating a lack of regular updates, unclear follow-ups, or insufficient engagement between the study organizers and participants.

        - **Timeline Information**: Refers to feedback highlighting the need for more details about the schedule, specific deadlines, or the timing of study-related tasks or events.

        - **Technical or Scheduling Difficulties**: Refers to feedback describing issues with technology (e.g., broken links, platform errors) or challenges in aligning schedules or coordinating study participation.

        - **Compensation**: Refers to feedback regarding the need for clear information about payments, incentives, or rewards (including gift cards) for participation in the study.

        - **Study Objectives**: Refers to feedback suggesting a need for better clarity or communication about the purpose, goals, or aims of the study.

        - **Results**: Refers to feedback requesting more information about the lab tests, findings, or overall conclusions derived from the study.

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