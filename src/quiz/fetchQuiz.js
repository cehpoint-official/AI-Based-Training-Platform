useEffect(() => {
    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://api.openai.com/v1/engines/davinci/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.REACT_APP_AI_API_KEY}`,
                },
                body: JSON.stringify({
                    prompt: `Generate a quiz on ${courseTitle}`,
                    max_tokens: 150,
                }),
            });
            const data = await response.json();
            const generatedQuiz = data.choices[0].text.split("\n").map((line, index) => ({
                question: line,
                options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], // You can customize this
                answer: 0,  // Just an example, customize as needed
            }));
            setQuestions(generatedQuiz);
        } catch (error) {
            console.error("Error fetching quiz:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchQuiz();
}, [courseTitle]);
