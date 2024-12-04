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

    const stream = await session.promptStreaming(text);

    let childElement = document.createElement("div");
    outputElement.insertAdjacentHTML("beforeend", `<h5>${text}</h5>`)
    outputElement.insertAdjacentElement("beforeend", childElement)
    for await (const part of stream) {
        childElement.textContent = part;
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