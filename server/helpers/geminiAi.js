const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_API_KEY
})

async function generateProjectTemplate(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User ingin membuat project dengan topik: "${prompt}".
            Buatkan template project manajemen yang terdiri dari Nama Project, Deskripsi, dan daftar Activity (To-do list).
            
            OUTPUT HARUS DALAM FORMAT JSON MURNI (MINIFIED), TANPA BACKTICKS ATAU TEKS LAINNYA.
            Struktur JSON:
            {
                "name": "Nama Project",
                "description": "Deskripsi singkat project",
                "activities": [
                    "Judul aktivitas 1",
                    "Judul aktivitas 2",
                    "Judul aktivitas 3"
                ]
            }
            Berikan maksimal 5 aktivitas yang relevan.`
        })

        let clearResponse = response.text.replace("```json", "").replace("```", "");
        
        return JSON.parse(clearResponse)
    } catch (error) {
        console.error("Error generating project template:", error)
        throw error
    }
}

module.exports = {
    generateProjectTemplate
}