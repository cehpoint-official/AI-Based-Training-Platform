//IMPORT
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();
const gis = require('g-i-s');
const youtubesearchapi = require("youtube-search-api");
const { YoutubeTranscript } = require("youtube-transcript");
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const { createApi } = require('unsplash-js');
const showdown = require('showdown');
// const axios = require('axios');


//INITIALIZE
const app = express();
const allowedOrigins = ['http://localhost:3000','https://ai-based-training-platfo-ca895.web.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));
 const PORT = process.env.PORT;
app.use(bodyParser.json());
const mongoURI = process.env.MONGO_URI; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const unsplash = createApi({ accessKey: process.env.UNSPLASH_ACCESS_KEY });

//SCHEMA

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    mName: String,
    password: String,
    type: String,
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
});
const courseSchema = new mongoose.Schema({
    user: String,
    content: { type: String, required: true },
    type: String,
    mainTopic: String,
    photo: String,
    date: { type: Date, default: Date.now },
    end: { type: Date, default: Date.now },
    completed: { type: Boolean, default: false }
});


//MODEL
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);

//REQUEST

//SIGNUP



app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/signup', async (req, res) => {
    const { email, mName, password, type } = req.body;

    try {
        const estimate = await User.estimatedDocumentCount();
        if (estimate > 0) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.json({ success: false, message: 'User with this email already exists' });
            }
            const newUser = new User({ email, mName, password, type });
            await newUser.save();
            res.json({ success: true, message: 'Account created successfully', userId: newUser._id });
        } else {
            const newUser = new User({ email, mName, password, type });
            await newUser.save();
            // const newAdmin = new Admin({ email, mName, type: 'main' });
            // await newAdmin.save();
            res.json({ success: true, message: 'Account created successfully', userId: newUser._id });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



//SIGNIN
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        if (password === user.password) {
            return res.json({ success: true, message: 'SignIn successful', userData: user });
        }

        res.json({ success: false, message: 'Invalid email or password' });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Invalid email or password' });
    }

});

//SEND MAIL
app.post('/api/data', async (req, res) => {
    const receivedData = req.body;

    try {
        const emailHtml = receivedData.html;

        const options = {
            from: process.env.EMAIL,
            to: receivedData.to,
            subject: receivedData.subject,
            html: emailHtml,
        };

        const data = await transporter.sendMail(options);
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json(error);
    }
});

//FOROGT PASSWORD
app.post('/api/forgot', async (req, res) => {
    const { email, name, company, logo } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();

        const resetLink = `${process.env.WEBSITE_URL}/reset-password/${token}`;

        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: `${name} Password Reset`,
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            <html lang="en">
            
              <head></head>
             <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Password Reset<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
             </div>
            
              <body style="margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;background-color:rgb(255,255,255);font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;">
                <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin-left:auto;margin-right:auto;margin-top:40px;margin-bottom:40px;width:465px;border-radius:0.25rem;border-width:1px;border-style:solid;border-color:rgb(234,234,234);padding:20px">
                  <tr style="width:100%">
                    <td>
                      <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-top:32px">
                        <tbody>
                          <tr>
                            <td><img alt="Vercel" src="${logo}" width="40" height="37" style="display:block;outline:none;border:none;text-decoration:none;margin-left:auto;margin-right:auto;margin-top:0px;margin-bottom:0px" /></td>
                          </tr>
                        </tbody>
                      </table>
                      <h1 style="margin-left:0px;margin-right:0px;margin-top:30px;margin-bottom:30px;padding:0px;text-align:center;font-size:24px;font-weight:400;color:rgb(0,0,0)">Password Reset</h1>
                      <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Click on the button below to reset the password for your account ${email}.</p>
                      <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%" style="margin-bottom:32px;margin-top:32px;text-align:center">
                        <tbody>
                          <tr>
                            <td><a href="${resetLink}" target="_blank" style="p-x:20px;p-y:12px;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:12px 20px;border-radius:0.25rem;background-color:rgb(0,0,0);text-align:center;font-size:12px;font-weight:600;color:rgb(255,255,255);text-decoration-line:none"><span></span><span style="p-x:20px;p-y:12px;max-width:100%;display:inline-block;line-height:120%;text-decoration:none;text-transform:none;mso-padding-alt:0px;mso-text-raise:9px"</span><span>Reset</span></a></td>
                          </tr>
                        </tbody>
                      </table>
                      <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Best,<p target="_blank" style="color:rgb(0,0,0);text-decoration:none;text-decoration-line:none">The <strong>${company}</strong> Team</p></p>
                      </td>
                  </tr>
                </table>
              </body>
            
            </html>`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Password reset link sent to your email' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//FOROGT PASSWORD
app.post('/api/reset-password', async (req, res) => {
    const { password, token } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.json({ success: true, message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ success: true, message: 'Password updated successfully', email: user.email });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//GET DATA FROM MODEL
app.post('/api/prompt', async (req, res) => {
    const receivedData = req.body;

    const promptString = receivedData.prompt;

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });

    const prompt = promptString;

    await model.generateContent(prompt).then(result => {
        const response = result.response;
        const generatedText = response.text();
        res.status(200).json({ generatedText });
    }).catch(error => {
        res.status(500).json({ success: false, message: 'Internal server error' });
    })
});

//GET GENERATE THEORY
app.post('/api/generate', async (req, res) => {
    const receivedData = req.body;
 
    const promptString = receivedData.prompt;

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings });

    const prompt = promptString

    await model.generateContent(prompt).then(result => {
        const response = result.response;
        const txt = response.text();
        const converter = new showdown.Converter();
        const markdownText = txt;
        const text = converter.makeHtml(markdownText);
        res.status(200).json({ text });
    }).catch(error => {
        res.status(500).json({ success: false, message: 'Internal server error' });
    })

});

//GET IMAGE
app.post('/api/image', async (req, res) => {
    const receivedData = req.body;
    const promptString = receivedData.prompt;
    gis(promptString, logResults);
    function logResults(error, results) {
        if (error) {
            //ERROR
        }
        else {
            res.status(200).json({ url: results[0].url });
        }
    }
})

//GET VIDEO 
app.post('/api/yt', async (req, res) => {
    try {

        const receivedData = req.body;
        const promptString = receivedData.prompt;
        const video = await youtubesearchapi.GetListByKeyword(promptString, [false], [1], [{ type: 'video' }])
        const videoId = await video.items[0].id;
        res.status(200).json({ url: videoId });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

//GET TRANSCRIPT 
app.post('/api/transcript', async (req, res) => {
    const receivedData = req.body;
    const promptString = receivedData.prompt;
    YoutubeTranscript.fetchTranscript(promptString).then(video => {
        res.status(200).json({ url: video });
    }).catch(error => {
        res.status(500).json({ success: false, message: 'Internal server error' });
    })
});

//STORE COURSE
app.post('/api/course', async (req, res) => {
    const { user, content, type, mainTopic ,subtopics} = req.body;

    unsplash.search.getPhotos({
        query: mainTopic,
       
        page: 1,
        perPage: 1,
        orientation: 'landscape',
    }).then(async (result) => {
        const photos = result.response.results;
        const photo = photos[0].urls.regular
        try {
            const newCourse = new Course({ user, content, type, mainTopic, photo });
            await newCourse.save();
            res.json({ success: true, message: 'Course created successfully', courseId: newCourse._id });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })
  if(subtopics){
    unsplash.search.getPhotos({
        query: subtopics,
       
        page: 1,
        perPage: 1,
        orientation: 'landscape',
    }).then(async (result) => {
        const photos = result.response.results;
        const photo = photos[0].urls.regular
        try {
            const newCourse = new Course({ user, content, type, subtopics, photo });
            await newCourse.save();
            res.json({ success: true, message: 'Course created successfully', courseId: newCourse._id });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    })
  }
});

//UPDATE COURSE
app.post('/api/update', async (req, res) => {
    const { content, courseId } = req.body;
    try {

        await Course.findOneAndUpdate(
            { _id: courseId },
            [{ $set: { content: content } }]
        ).then(result => {
            res.json({ success: true, message: 'Course updated successfully' });
        }).catch(error => {
            res.status(500).json({ success: false, message: 'Internal server error' });
        })

    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.post('/api/finish', async (req, res) => {
    const { courseId } = req.body;
    try {

        await Course.findOneAndUpdate(
            { _id: courseId },
            { $set: { completed: true, end: Date.now() } }
        ).then(result => {
            res.json({ success: true, message: 'Course completed successfully' });
        }).catch(error => {

            res.status(500).json({ success: false, message: 'Internal server error' });
        })

    } catch (error) {

        res.status(500).json({ success: false, message: 'Internal server error' });
    }

});

//SEND CERTIFICATE
app.post('/api/sendcertificate', async (req, res) => {
    const { html, email } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });

    const options = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Certification of completion',
        html: html
    };

    transporter.sendMail(options, (error, info) => {
        if (error) {
            res.status(500).json({ success: false, message: 'Failed to send email' });
        } else {
            res.json({ success: true, message: 'Email sent successfully' });
        }
    });
});

//GET ALL COURSES
app.get('/api/courses', async (req, res) => {
    try {
        const { userId } = req.query;
        await Course.find({ user: userId }).then((result) => {
            res.json(result);
        });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

//GET PROFILE DETAILS
app.post('/api/profile', async (req, res) => {
    const { email, mName, password, uid } = req.body;
    try {

        if (password === '') {
            await User.findOneAndUpdate(
                { _id: uid },
                { $set: { email: email, mName: mName } }
            ).then(result => {
                res.json({ success: true, message: 'Profile Updated' });
            }).catch(error => {

                res.status(500).json({ success: false, message: 'Internal server error' });
            })
        } else {
            await User.findOneAndUpdate(
                { _id: uid },
                { $set: { email: email, mName: mName, password: password } }
            ).then(result => {
                res.json({ success: true, message: 'Profile Updated' });
            }).catch(error => {

                res.status(500).json({ success: false, message: 'Internal server error' });
            })
        }

    } catch (error) {

        res.status(500).json({ success: false, message: 'Internal server error' });
    }

});
//CHAT
app.post('/api/chat', async (req, res) => {
    const receivedData = req.body;

    const promptString = receivedData.prompt;

    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ];

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings });

    const prompt = promptString;

    await model.generateContent(prompt).then(result => {
        const response = result.response;
        const txt = response.text();
        const converter = new showdown.Converter();
        const markdownText = txt;
        const text = converter.makeHtml(markdownText);
        res.status(200).json({ text });
    }).catch(error => {
        res.status(500).json({ success: false, message: 'Internal server error' });
    })

});


//LISTEN
// const port = process.env.PORT || 5000;
// app.listen(port, () => { 
//     console.log(`Server is running on port ${port}`);
// });
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


app.post('/api/project-suggestions', async (req, res) => {
    const { prompt } = req.body;

    try {
        // Replace with your AI generation logic or call to another service
        const response = await someAIService.generateProjectSuggestions(prompt);
        res.json({ suggestions: response.data });
    } catch (error) {
        console.error("Error generating project suggestions:", error);
        res.status(500).send("Error generating project suggestions");
    }
});
