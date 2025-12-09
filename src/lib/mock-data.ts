
import type { QuizQuestion, CourseModule, Course } from './types';

export const courses: Course[] = [
  {
    id: 1,
    title: 'Integrative Technologies',
    description: 'Courses that cover integrating different technologies, systems, or platforms so they work together seamlessly. It’s about integration — making sure data flows smoothly across apps, networks, and devices.',
    color: 'purple',
    modules: [
      {
        id: 1,
        title: 'Introduction to Integrative Technologies',
        description: 'Learn the fundamentals of integrative technologies and how different systems can work together seamlessly.',
        content: [
          {
            type: 'paragraph',
            text: 'Introduction to Integrative Technologies focuses on the fundamental concepts and principles of making different software and hardware systems work together. In today\'s interconnected world, no system truly works in isolation. This module explores the strategies and technologies that enable seamless communication and data flow between diverse applications, platforms, and services.'
          },
          {
            type: 'paragraph',
            text: 'We will cover the history of system integration, from early point-to-point connections to modern API-driven ecosystems. You will learn about the challenges of integration, such as data silos, legacy systems, and security concerns, and discover the architectural patterns used to overcome them.'
          },
          {
            type: 'header',
            text: 'Key Topics'
          },
          {
            type: 'list',
            items: [
              'Understanding the need for integration.',
              'Types of integration: data, application, and process.',
              'Introduction to APIs (Application Programming Interfaces).',
              'Middleware and its role in integration.',
              'Common integration challenges and solutions.'
            ]
          }
        ],
        quizId: 'quiz1',
      },
       {
        id: 2,
        title: 'System Interoperability',
        description: 'Explore how applications communicate using APIs, protocols, and data formats to achieve smooth integration.',
        content: [
          {
            type: 'paragraph',
            text: 'System Interoperability refers to the ability of different systems, applications, or devices to exchange, understand, and use information with each other.'
          },
          {
            type: 'paragraph',
            text: 'Interoperability matters because organizations often use multiple systems (e.g., databases, apps, APIs). If these systems cannot communicate, operations become slow, inconsistent, or error-prone.'
          },
          {
            type: 'header',
            text: '3 Levels of Interoperability'
          },
          {
            type: 'paragraph',
            text: 'Technical Interoperability\nFocus: Infrastructure and technology\nEnsures systems can connect and exchange data\nExamples: APIs, network protocols, data formats (JSON, XML)'
          },
           {
            type: 'paragraph',
            text: 'Semantic Interoperability\nFocus: Meaning of data\nEnsures systems interpret shared data the same way\nExample: Both systems understand that “DOB” means “Date of Birth”'
          },
           {
            type: 'paragraph',
            text: 'Organizational Interoperability\nFocus: Policies and business rules\nEnsures organizations agree on how data should be used\nExample: Two departments follow the same data-sharing policy'
          },
          {
            type: 'header',
            text: 'Why Interoperability Is Important'
          },
          {
            type: 'list',
            items: [
                'Faster communication between systems',
                'Reduced manual work',
                'Higher data accuracy',
                'Easier integration of new technologies',
                'Supports automation and digital transformation'
            ]
          }
        ],
        quizId: 'quiz2',
      },
      {
        id: 3,
        title: 'Cloud Integration',
        description: 'Understand how cloud services can be connected and synchronized for efficient data flow across platforms.',
        content: [
          {
            type: 'paragraph',
            text: 'Cloud Integration is the process of connecting different cloud services, applications, and on-premise systems so they can share data and work together smoothly.'
          },
          {
            type: 'paragraph',
            text: 'It helps organizations combine multiple tools—like databases, SaaS apps, and cloud storage—into one unified workflow.'
          },
          {
            type: 'header',
            text: 'Key Goals of Cloud Integration'
          },
          {
            type: 'list',
            items: [
              'Data Sharing: Systems can send and receive information automatically.',
              'Application Connectivity: Different apps (cloud or local) work together as one system.',
              'Process Automation: Tasks flow between systems without manual steps.',
              'Centralized Access: Users can access information from different systems in one place.'
            ]
          },
          {
            type: 'header',
            text: 'Common Tools/Methods'
          },
          {
            type: 'list',
            items: [
              'APIs',
              'iPaaS (Integration Platform as a Service) tools',
              'Webhooks',
              'Cloud storage syncing (e.g., Google Drive → App)'
            ]
          }
        ],
        quizId: 'quiz3',
      },
      {
        id: 4,
        title: 'IoT & Smart Systems',
        description: 'Discover how IoT devices and smart systems interact and share data to create automated environments.',
        content: [
          {
            type: 'paragraph',
            text: 'Internet of Things (IoT) refers to everyday devices connected to the internet so they can collect data, send data, and perform actions automatically.\nExamples: smart watches, smart refrigerators, home sensors, CCTV cameras, smart farm systems.'
          },
          {
            type: 'paragraph',
            text: 'Smart Systems are systems that use IoT devices plus automation, data processing, and sometimes AI to make decisions or perform tasks without human input.\nExample: A smart home that turns lights off when you leave.'
          },
          {
            type: 'header',
            text: 'How IoT Works'
          },
          {
            type: 'list',
            items: [
              'Devices/Sensors collect data (temperature, motion, location, etc.)',
              'Connectivity sends data through Wi-Fi, Bluetooth, or mobile networks',
              'Cloud/Server Processing analyzes the data',
              'Actions are triggered (turn on AC, send notification, control machines)'
            ]
          },
          {
            type: 'header',
            text: 'Benefits'
          },
          {
            type: 'list',
            items: [
              'Automation',
              'Real-time monitoring',
              'Better decision-making',
              'Energy efficiency',
              'Convenience'
            ]
          }
        ],
        quizId: 'quiz4',
      },
      {
        id: 5,
        title: 'Automation & Workflow Integration',
        description: 'Learn how to automate processes and workflows by connecting apps and systems effectively.',
        content: [
          {
            type: 'paragraph',
            text: 'Automation refers to using software or systems to perform tasks without manual effort. This reduces errors, speeds up processes, and frees people from repetitive work.'
          },
          {
            type: 'paragraph',
            text: 'Workflow Integration means connecting different tools, apps, or systems so tasks can flow automatically from one step to another.'
          },
          {
            type: 'paragraph',
            text: 'Together, Automation + Workflow Integration create smooth, connected processes where actions trigger other actions automatically.'
          },
          {
            type: 'header',
            text: 'Example'
          },
          {
            type: 'paragraph',
            text: 'A form is submitted → data is saved → email confirmation is sent → task is added to a dashboard (All without human involvement.)'
          },
          {
            type: 'header',
            text: 'Key Benefits'
          },
          {
            type: 'list',
            items: [
              'Faster processes',
              'Fewer manual errors',
              'Better productivity',
              'Real-time updates between systems',
              'Consistent workflows'
            ]
          },
          {
            type: 'header',
            text: 'Common Tools'
          },
          {
            type: 'list',
            items: [
              'Zapier',
              'Power Automate',
              'IFTTT',
              'API-based integrations',
              'Workflow engines (Camunda, BPM tools)'
            ]
          }
        ],
        quizId: 'quiz5',
      }
    ]
  },
  {
    id: 2,
    title: 'Database and Design',
    description: 'Involves structuring, storing, and managing data while also creating user-centric interfaces that make information clear and accessible. It’s about organizing data efficiently and presenting it beautifully.',
    color: 'blue',
    modules: [
      {
        id: 6,
        title: 'Intro to Databases',
        description: 'An intro to DBs.',
        content: [],
        quizId: 'quiz1',
      },
      {
        id: 7,
        title: 'Advanced Databases',
        description: 'An advanced look at DBs.',
        content: [],
        quizId: 'quiz1',
      }
    ]
  },
  {
    id: 3,
    title: 'UI/UX Theories and Concepts',
    description: 'Learn to analyze what works on an app, and why. UI focuses on design and visuals, while UX ensures the app is easy to use. It’s about how an app looks and how it works for the user.',
    color: 'red',
    modules: []
  },
  {
    id: 4,
    title: 'Software Engineering',
    description: 'The process of designing, building, testing, and maintaining software systems. It combines programming skills, problem-solving, and teamwork to create reliable and efficient applications that meet users’ needs.',
    color: 'yellow',
    modules: []
  }
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    courseId: 1,
    moduleId: 1,
    question: 'What is the primary purpose of the `useState` hook in React?',
    options: [
      { id: 'q1a1', text: 'To manage side effects in functional components.' },
      { id: 'q1a2', text: 'To add state variables to functional components.' },
      { id: 'q1a3', text: 'To fetch data from an API.' },
      { id: 'q1a4', text: 'To create a context for state sharing.' },
    ],
    correctAnswerId: 'q1a2',
    explanation: 'The `useState` hook is a fundamental React feature that allows functional components to declare and manage their own internal state, which was previously only possible in class components.',
  },
  {
    id: 'q2',
    courseId: 1,
    moduleId: 1,
    question: 'In Next.js, what is the recommended way to fetch data for a page that needs to be server-rendered?',
    options: [
      { id: 'q2a1', text: 'Using the `useEffect` hook inside the component.' },
      { id: 'q2a2', text: 'Using a client-side library like Axios on component mount.' },
      { id: 'q2a3', text: 'Exporting an async function named `getServerSideProps`.' },
      { id: 'q2a4', text: 'Using the `getStaticProps` function for dynamic data.' },
    ],
    correctAnswerId: 'q2a3',
    explanation: '`getServerSideProps` runs on the server for every request, making it ideal for pages that need to fetch fresh data and be rendered on the server before being sent to the client.',
  },
  {
    id: 'q3',
    courseId: 1,
    moduleId: 1,
    question: 'Which of the following is a core concept of Tailwind CSS?',
    options: [
      { id: 'q3a1', text: 'Component-based styling with scoped CSS.' },
      { id: 'q3a2', text: 'A "write-once, use-anywhere" CSS-in-JS solution.' },
      { id: 'q3a3', text: 'A utility-first CSS framework for rapid UI development.' },
      { id: 'q3a4', text: 'A preprocessor that adds variables and nesting to CSS.' },
    ],
    correctAnswerId: 'q3a3',
    explanation: 'Tailwind CSS is a utility-first framework that provides low-level utility classes to build designs directly in your markup, allowing for rapid and consistent UI development without writing custom CSS.',
  },
    {
    id: 'q4',
    courseId: 1,
    moduleId: 1,
    question: 'What does the `key` prop do in a list of React elements?',
    options: [
      { id: 'q4a1', text: 'It is used for styling the list items.' },
      { id: 'q4a2', text: 'It is a globally unique identifier for the element.' },
      { id: 'q4a3', text: 'It helps React identify which items have changed, are added, or are removed.' },
      { id: 'q4a4', text: 'It sets the database primary key for the item.' },
    ],
    correctAnswerId: 'q4a3',
    explanation: 'The `key` prop provides a stable identity to elements in a list. This allows React to efficiently update the UI by tracking which items have been added, changed, or removed, which improves performance.',
  },
  {
    id: 'q5',
    courseId: 1,
    moduleId: 1,
    question: 'In TypeScript, what is the `interface` keyword used for?',
    options: [
        { id: 'q5a1', text: 'To declare a new class.' },
        { id: 'q5a2', text: 'To create a loop.' },
        { id: 'q5a3', text: 'To define the shape of an object, or a contract for a class to implement.' },
        { id: 'q5a4', text: 'To import modules from other files.' },
    ],
    correctAnswerId: 'q5a3',
    explanation: 'An `interface` in TypeScript is used to define the structure of an object. It acts as a contract, ensuring that objects or classes adhere to a specific shape, which improves code quality and maintainability.',
  },
  {
    id: 'q6',
    courseId: 1,
    moduleId: 2,
    question: 'What is system interoperability?',
    options: [
      { id: 'q6a1', text: 'Systems that can talk and work together' },
      { id: 'q6a2', text: 'Systems that run faster' },
      { id: 'q6a3', text: 'Systems that use the same hardware' },
    ],
    correctAnswerId: 'q6a1',
    explanation: 'System interoperability is the ability of different systems to exchange and make use of information.',
  },
  {
    id: 'q7',
    courseId: 1,
    moduleId: 2,
    question: 'Which level of interoperability ensures systems understand data meaning?',
    options: [
      { id: 'q7a1', text: 'Technical' },
      { id: 'q7a2', text: 'Semantic' },
      { id: 'q7a3', text: 'Organizational' },
    ],
    correctAnswerId: 'q7a2',
    explanation: 'Semantic interoperability is about ensuring that the precise meaning of exchanged information is understandable by any other system.',
  },
  {
    id: 'q8',
    courseId: 1,
    moduleId: 2,
    question: 'What does technical interoperability focus on?',
    options: [
      { id: 'q8a1', text: 'Policies' },
      { id: 'q8a2', text: 'Hardware and connections' },
      { id: 'q8a3', text: 'Data meaning' },
    ],
    correctAnswerId: 'q8a2',
    explanation: 'Technical interoperability is concerned with the hardware, software, and communication protocols that enable systems to connect and exchange data.',
  },
  {
    id: 'q9',
    courseId: 1,
    moduleId: 2,
    question: 'Why is interoperability important?',
    options: [
      { id: 'q9a1', text: 'It makes systems communicate better' },
      { id: 'q9a2', text: 'It slows down processing' },
      { id: 'q9a3', text: 'It removes data' },
    ],
    correctAnswerId: 'q9a1',
    explanation: 'Interoperability is crucial for enabling faster, more accurate communication and data sharing between different systems.',
  },
  {
    id: 'q10',
    courseId: 1,
    moduleId: 2,
    question: 'Which file format is commonly used for data exchange?',
    options: [
      { id: 'q10a1', text: '.exe' },
      { id: 'q10a2', text: 'JSON' },
      { id: 'q10a3', text: '.mp3' },
    ],
    correctAnswerId: 'q10a2',
    explanation: 'JSON (JavaScript Object Notation) is a lightweight and widely adopted format for data interchange between systems and applications.',
  },
  {
    id: 'q11',
    courseId: 1,
    moduleId: 3,
    question: 'What is cloud integration?',
    options: [
      { id: 'q11a1', text: 'Connecting cloud and on-premise systems' },
      { id: 'q11a2', text: 'Installing software offline' },
      { id: 'q11a3', text: 'Backing up files manually' },
    ],
    correctAnswerId: 'q11a1',
    explanation: 'Cloud integration is the process of connecting different cloud services, applications, and on-premise systems so they can share data and work together smoothly.',
  },
  {
    id: 'q12',
    courseId: 1,
    moduleId: 3,
    question: 'What is a common goal of cloud integration?',
    options: [
      { id: 'q12a1', text: 'Increase manual work' },
      { id: 'q12a2', text: 'Allow systems to share data' },
      { id: 'q12a3', text: 'Remove cloud services' },
    ],
    correctAnswerId: 'q12a2',
    explanation: 'A key goal of cloud integration is to enable seamless data sharing between different systems and applications.',
  },
  {
    id: 'q13',
    courseId: 1,
    moduleId: 3,
    question: 'Which tool is commonly used in cloud integration?',
    options: [
      { id: 'q13a1', text: 'APIs' },
      { id: 'q13a2', text: 'USB drives' },
      { id: 'q13a3', text: 'Printers' },
    ],
    correctAnswerId: 'q13a1',
    explanation: 'APIs (Application Programming Interfaces) are a fundamental tool for allowing different cloud services and applications to communicate with each other.',
  },
  {
    id: 'q14',
    courseId: 1,
    moduleId: 3,
    question: 'What does iPaaS stand for?',
    options: [
      { id: 'q14a1', text: 'Internal Platform as a Service' },
      { id: 'q14a2', text: 'Integration Platform as a Service' },
      { id: 'q14a3', text: 'Internet Processing and Storage' },
    ],
    correctAnswerId: 'q14a2',
    explanation: 'iPaaS stands for Integration Platform as a Service, which are cloud-based platforms that help automate and simplify integration processes.',
  },
  {
    id: 'q15',
    courseId: 1,
    moduleId: 3,
    question: 'Which is a benefit of cloud integration?',
    options: [
      { id: 'q15a1', text: 'Slower access to information' },
      { id: 'q15a2', text: 'Separate, isolated systems' },
      { id: 'q15a3', text: 'Automated workflows' },
    ],
    correctAnswerId: 'q15a3',
    explanation: 'A major benefit of cloud integration is the ability to create automated workflows that span multiple systems, reducing manual effort and increasing efficiency.',
  },
  {
    id: 'q16',
    courseId: 1,
    moduleId: 4,
    question: 'What does IoT stand for?',
    options: [
      { id: 'q16a1', text: 'Internet of Technology' },
      { id: 'q16a2', text: 'Internet of Things' },
      { id: 'q16a3', text: 'Information of Tools' },
    ],
    correctAnswerId: 'q16a2',
    explanation: 'IoT stands for Internet of Things, which refers to the network of physical devices that are embedded with sensors and other technologies for the purpose of connecting and exchanging data over the Internet.',
  },
  {
    id: 'q17',
    courseId: 1,
    moduleId: 4,
    question: 'What is the main purpose of IoT devices?',
    options: [
      { id: 'q17a1', text: 'To collect and share data' },
      { id: 'q17a2', text: 'To print documents' },
      { id: 'q17a3', text: 'To store files only' },
    ],
    correctAnswerId: 'q17a1',
    explanation: 'The primary function of IoT devices is to collect data from their surroundings via sensors and share that data over a network for processing and action.',
  },
  {
    id: 'q18',
    courseId: 1,
    moduleId: 4,
    question: 'Which of the following is an example of a smart system?',
    options: [
      { id: 'q18a1', text: 'A regular light bulb' },
      { id: 'q18a2', text: 'A light that turns on automatically using sensors' },
      { id: 'q18a3', text: 'A flashlight' },
    ],
    correctAnswerId: 'q18a2',
    explanation: 'A smart system uses data (from sensors) to make decisions, such as a light turning on automatically when it detects motion, which is a core concept of IoT and automation.',
  },
  {
    id: 'q19',
    courseId: 1,
    moduleId: 4,
    question: 'What component collects data in an IoT system?',
    options: [
      { id: 'q19a1', text: 'Sensors' },
      { id: 'q19a2', text: 'Shoes' },
      { id: 'q19a3', text: 'Screens' },
    ],
    correctAnswerId: 'q19a1',
    explanation: 'Sensors are the fundamental components of IoT devices that are responsible for collecting physical data from the environment, such as temperature, motion, or light.',
  },
  {
    id: 'q20',
    courseId: 1,
    moduleId: 4,
    question: 'Which network is commonly used for IoT communication?',
    options: [
      { id: 'q20a1', text: 'Wi-Fi' },
      { id: 'q20a2', text: 'HDMI' },
      { id: 'q20a3', text: 'USB' },
    ],
    correctAnswerId: 'q20a1',
    explanation: 'Wi-Fi is a very common wireless networking technology used to connect IoT devices to the internet, allowing them to send and receive data.',
  },
  {
    id: 'q21',
    courseId: 1,
    moduleId: 5,
    question: 'What is automation?',
    options: [
      { id: 'q21a1', text: 'Doing tasks manually' },
      { id: 'q21a2', text: 'Using systems to perform tasks automatically' },
      { id: 'q21a3', text: 'Disconnecting systems' },
    ],
    correctAnswerId: 'q21a2',
    explanation: 'Automation is the use of technology to perform tasks with reduced human assistance.'
  },
  {
    id: 'q22',
    courseId: 1,
    moduleId: 5,
    question: 'What is workflow integration?',
    options: [
      { id: 'q22a1', text: 'Combining different tasks into one large task' },
      { id: 'q22a2', text: 'Connecting systems so tasks flow automatically' },
      { id: 'q22a3', text: 'Removing steps from a process' },
    ],
    correctAnswerId: 'q22a2',
    explanation: 'Workflow integration involves connecting different software tools and systems to allow for a seamless flow of data and tasks between them.'
  },
  {
    id: 'q23',
    courseId: 1,
    moduleId: 5,
    question: 'Which of the following is a benefit of automation?',
    options: [
      { id: 'q23a1', text: 'More manual work' },
      { id: 'q23a2', text: 'Slower processes' },
      { id: 'q23a3', text: 'Reduced errors' },
    ],
    correctAnswerId: 'q23a3',
    explanation: 'By automating tasks, businesses can reduce the likelihood of human error, leading to more accurate and reliable outcomes.'
  },
  {
    id: 'q24',
    courseId: 1,
    moduleId: 5,
    question: 'Which tool is commonly used for automation?',
    options: [
      { id: 'q24a1', text: 'Zapier' },
      { id: 'q24a2', text: 'Paint' },
      { id: 'q24a3', text: 'Notepad' },
    ],
    correctAnswerId: 'q24a1',
    explanation: 'Zapier is a popular online automation tool that connects apps and services to automate repetitive tasks without coding.'
  },
  {
    id: 'q25',
    courseId: 1,
    moduleId: 5,
    question: 'What happens when automation and workflow integration are used together?',
    options: [
      { id: 'q25a1', text: 'Processes become slower' },
      { id: 'q25a2', text: 'Steps trigger automatically and smoothly' },
      { id: 'q25a3', text: 'Systems stop communicating' },
    ],
    correctAnswerId: 'q25a2',
    explanation: 'The combination of automation and workflow integration creates a seamless and efficient process where tasks are automatically triggered and executed across different systems.'
  }
];

    

    