async function callNano(text) {
    console.log(text)
    let temperature = 0.0
    let topK = 3
    let outputElement = document.getElementById("output")

    let systemPrompt = `
You are an expert coder of open text surveys. Participants were asked " Is there anything missing from our study communications that we should add?".  You will be given a question response. Please only respond using the follow JSON schema no other response should be given
{
"properties": {
    "category": {"type": "string"},
    "enum": ["Infrequent communication","Desire for results","Desire to report additional information",
            "Timeline Information","Technical or scheduling difficulties","Questions about Compensation",
            "None of the Above"]
}`

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