(()=>{
const {GH,jobs,edu,projects,skills,svc,soc,projectDetails,certs}=window.D;
const $=selector=>document.querySelector(selector);
const toggle=$('#career-chat-toggle'),panel=$('#career-chat-panel'),close=$('#career-chat-close');
const log=$('#career-chat-messages'),form=$('#career-chat-form'),input=$('#career-chat-input'),prompts=$('#career-chat-prompts');
const normalize=value=>value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9.+#]+/g,' ').trim();
const words=value=>normalize(value).split(/\s+/).filter(word=>word.length>1);
const availabilityText=document.querySelector('.tag')?.textContent||'Available for work in Kerala, India';
const availabilityParts=availabilityText.split(/[^a-zA-Z0-9, ]+/).map(part=>part.trim()).filter(Boolean);
const profile={
 name:'Muhammed Jahsh V',
 role:'AI Developer, Data Scientist, and Data Analyst',
 location:'Malappuram, Kerala, India',
 availability:availabilityParts.length>1?`${availabilityParts[0]} in ${availabilityParts.slice(1).join(' ')}`:availabilityParts[0],
 email:document.querySelector('a[href^="mailto:"]')?.getAttribute('href').slice(7)||'jahshvrd@gmail.com',
 phone:document.querySelector('a[href^="tel:"]')?.textContent.trim()||'',
 years:'3.5+ years'
};
const linkedin=soc.find(([name])=>/linkedin/i.test(name))?.[1]||'';
const stopWords=new Set(['about','an','and','are','can','career','did','do','does','for','he','his','how','i','in','is','it','me','my','of','on','project','projects','tell','the','this','to','what','which','with','your','jahsh']);
let lastProject=null;
function addMessage(text,who){
 const message=document.createElement('div');message.className=`chat-message ${who}`;
 text.split(/\n\n+/).filter(Boolean).forEach(paragraph=>{
  const p=document.createElement('p'),emailParts=paragraph.split(profile.email);
  emailParts.forEach((part,index)=>{
   if(part)p.append(document.createTextNode(part));
   if(index<emailParts.length-1){const link=document.createElement('a');link.href=`mailto:${profile.email}`;link.textContent=profile.email;p.append(link)}
  });
  message.append(p);
 });
 log.append(message);log.scrollTop=log.scrollHeight;
}
function contactAnswer(){return `Contact ${profile.name} at ${profile.email}${profile.phone?` or ${profile.phone}`:''}${linkedin?`. LinkedIn: ${linkedin}`:''}.`}
function unsupported(topic){
 const subject=topic?`I couldn't find verified information about ${topic} in the portfolio.`:"I couldn't match that question to information in the portfolio.";
 return `${subject} I don't want to guess. Try asking about his career, skills, availability, or a project—or ${contactAnswer()}`;
}
function currentRoles(){
 return jobs.filter(job=>/present/i.test(job[0]));
}
function careerSummary(){
 const current=currentRoles().map(job=>`${job[1]} at ${job[2]}`);
 const focus=skills.slice(0,5).map(group=>group[0].toLowerCase()).join(', ');
 return `${profile.name} is an ${profile.role} based in ${profile.location}, with ${profile.years} across machine learning, agentic AI, and analytics. Current roles listed: ${current.join(' and ')}. His portfolio covers ${focus}, training, and ${projects.length} projects. ${profile.availability}.`;
}
function experienceAnswer(question){
 const query=normalize(question);
 const employers=[...new Set(jobs.map(job=>job[2]))];
 const employer=employers.find(name=>query.includes(normalize(name)));
 if(employer){
  const matched=jobs.filter(job=>job[2]===employer);
  return matched.map(job=>{
   const highlights=job[4].slice(0,3).map(item=>{
    const sentences=item.split(/(?<=[.!?])\s+/);
    const summary=sentences[0];
    return summary.split(/\s+/).length>24?`${summary.split(/\s+/).slice(0,24).join(' ').replace(/[,:;—-]+$/,'')}…`:summary;
   });
   return `${job[1]} at ${job[2]} · ${job[0]} · ${job[3]}. ${highlights.join(' ')}`;
  }).join('\n\n');
 }
 const current=currentRoles();
 if(/\b(current|currently|present|now)\b/.test(query)&&current.length)
  return `Current roles listed: ${current.map(job=>`${job[1]} at ${job[2]} (${job[0]})`).join('; ')}.`;
 if(/\b(full|complete|timeline|history|all roles|all jobs)\b/.test(query))
  return jobs.map(job=>`${job[0]} · ${job[1]} at ${job[2]} (${job[3]}): ${job[4][0]}`).join('\n');
 return careerSummary();
}
function educationAnswer(){
 return edu.map(item=>`${item[1]} — ${item[2]} (${item[0]})`).join('\n');
}
const projectAliases=[
 ['DocuLens',['document intelligence','document ai','document question answering','document q and a','document extraction','pdf question answering']],
 ['Excellent AI Academy',['excellent ai','ai academy','project driven learning','career readiness learning']],
 ['Enterprise Customer 360 Analytics Platform',['customer 360','customer analytics','customer intelligence','customer lifetime value','customer churn','rfm','crm analytics']],
 ['Supply Chain Performance Analytics Platform',['supply chain','inventory analytics','supplier performance','logistics analytics','otif']],
 ['E-commerce Business Intelligence Platform',['e commerce','ecommerce','online retail','e commerce analytics']],
 ['HR Workforce Analytics Dashboard',['hr analytics','human resources analytics','workforce analytics','employee attrition','recruitment analytics']],
 ['Rahya Village Demographic & Socio-Economic Analysis',['rahya','village demographics','village analysis','socio economic analysis']],
 ['Business Intelligence Dashboards',['business intelligence dashboard','bi dashboard','bi dashboards','tableau dashboard']]
];
function analyticsQuestion(query){
 const mentionsAnalytics=/\b(analytics|analytic|business intelligence|bi dashboard|bi dashboards|dashboard|dashboards|reporting)\b/.test(query);
 const asksProject=/\b(project|projects|work|platform|dashboard|dashboards|portfolio|built|show|list)\b/.test(query)||query.includes('tell me about');
 const asksCareer=/\b(experience|career|job|jobs|role|roles|training|trainer|skill|skills)\b/.test(query);
 const asksSkills=/\b(skill|skills|know|proficient|technology|technologies|tool|tools|stack|expertise)\b/.test(query);
 return mentionsAnalytics&&(asksProject||(!asksCareer&&!asksSkills));
}
const projectCategories=[
 ['Agentic AI',['agentic ai','multi agent','multi-agent']],
 ['AI Automation',['ai automation','workflow automation']],
 ['Business Automation',['business automation','ordering bot']],
 ['Computer Vision',['computer vision','vision projects','face recognition']],
 ['Machine Learning & Deep Learning',['machine learning projects','deep learning projects','ml projects']],
 ['FinTech & AI',['fintech','trading projects','trading bot']],
 ['NLP / Chatbot',['nlp chatbot','chatbots','conversational ai']],
 ['Cybersecurity',['cybersecurity','network security']],
 ['Developer Tools',['developer tools','code analysis']]
];
function projectCategoryAnswer(question){
 const query=normalize(question);
 const hasProjectIntent=/\b(project|projects|work|portfolio|built|show|list)\b/.test(query);
 if(!hasProjectIntent)return null;
 const group=projectCategories.find(([category,aliases])=>
  query.includes(normalize(category))||aliases.some(alias=>query.includes(normalize(alias))));
 if(!group)return null;
 const matches=projects.filter(project=>project[0]===group[0]);
 return matches.length?`${group[0]} projects:\n${matches.map(project=>`• ${project[1]}`).join('\n')}`:null;
}
function projectMatch(question){
 const query=normalize(question);
 const direct=projects.find(project=>query.includes(normalize(project[1])));
 if(direct)return direct;
 const alias=projectAliases.find(([,aliases])=>aliases.some(term=>query.includes(normalize(term))));
 if(alias)return projects.find(project=>project[1]===alias[0])||null;
 const queryWords=words(question).filter(word=>!stopWords.has(word));
 const genericWords=new Set(['ai','agentic','analytics','analytic','analysis','dashboard','dashboards','platform','business','intelligence','data','reporting']);
 let best=null,score=0;
 for(const project of projects){
  const titleWords=words(project[1]);
  const matches=queryWords.filter(word=>!genericWords.has(word)&&titleWords.includes(word)).length;
  const nextScore=matches/(Math.max(Math.min(titleWords.length,3),1));
  if(matches>0&&nextScore>score){best=project;score=nextScore}
 }
 return score>=.5?best:null;
}
function mentionedTechnologies(question){
 const query=` ${normalize(question)} `;
 const tools=[...new Set([...skills.flatMap(group=>group[2]),...projects.flatMap(project=>project[3])])]
  .sort((a,b)=>normalize(b).length-normalize(a).length);
 return tools.filter(tool=>{const name=normalize(tool);return name.length>1&&query.includes(` ${name} `)});
}
function analyticsProjects(question){
 const query=normalize(question);
 const matches=projects.filter(project=>project[0]==='Data Analytics');
 const requested=projectMatch(question);
 if(requested&&requested[0]==='Data Analytics')return[requested];
 if(/\b(using|use|with|built with|tool|tools|stack|technology|technologies)\b/.test(query)){
  const requestedTools=mentionedTechnologies(question);
  if(!requestedTools.length)return[];
  const filtered=matches.filter(project=>requestedTools.every(requestedTool=>
   project[3].some(tool=>normalize(tool)===normalize(requestedTool))));
  if(filtered.length)return filtered;
  return[];
 }
 const topics=[
  ['customer',['customer','customers','crm','rfm','churn','lifetime value']],
  ['supply',['supply','inventory','supplier','procurement','logistics','otif','warehouse']],
  ['e-commerce',['e-commerce','ecommerce','online orders','product performance','returns']],
  ['hr',['hr','workforce','employee','employees','recruitment','attrition','salary']],
  ['village',['rahya','village','demographic','socio-economic','agriculture']],
  ['dashboard',['tableau','dashboard','dashboards','reporting','visualisation','visualization']]
 ];
 const topic=topics.find(([,terms])=>terms.some(term=>query.includes(normalize(term))));
 if(topic){
  const relevant=matches.filter(project=>{
   const content=normalize(`${project[1]} ${project[2]} ${projectDetails[project[1]]?.join(' ')||''}`);
   return topic[1].some(term=>content.includes(normalize(term)));
  });
  if(relevant.length)return relevant;
 }
 return matches;
}
function analyticsAnswer(question){
 const results=analyticsProjects(question);
 if(!results.length){
  const tools=mentionedTechnologies(question);
  return tools.length?`No Data Analytics project in the portfolio explicitly lists ${tools.join(' and ')} in its tools.`:unsupported('a matching data analytics project');
 }
 if(results.length===1){
  return projectAnswer(results[0],question);
 }
 const label=results.length===projects.filter(project=>project[0]==='Data Analytics').length?'Data Analytics projects':'Matching Data Analytics projects';
 return `${label} in the portfolio:\n${results.map(project=>{
  const focus=project[2].split(/(?<=[.!?])\s+/)[0].split(/\s+/);
  const summary=focus.length>18?`${focus.slice(0,18).join(' ').replace(/[,:;—-]+$/,'')}…`:focus.join(' ');
  return `• ${project[1]} — ${summary} Tools: ${project[3].join(', ')}.`;
 }).join('\n')}`;
}
function projectAnswer(project,question){
 lastProject=project;
 const query=normalize(question);
 const questionIntent=query.replace(normalize(project[1]),'');
 const details=projectDetails[project[1]]||[];
 const description=project[2]||details[0]||'';
 const asksUsers=/\b(user|users|audience|beneficiar)\b|who (?:uses|would use|is this for|are the users)\b|\b(?:target|intended) customers\b/.test(questionIntent);
 const asksApi=/\b(api|apis|endpoint|endpoints|provider|providers)\b/.test(questionIntent);
 const asksTools=/\b(technology|technologies|tech stack|stack|tools|tool|framework|frameworks|built with|using)\b|\b(?:what|which) (?:does|do) (?:it|this|the project|they) use\b/.test(questionIntent);
 if(asksUsers&&details[1])
  return `${project[1]}: ${details[1]}`;
 if(asksApi){
  const apiTools=project[3].filter(tool=>/\bapi\b|fastapi/i.test(tool));
  return apiTools.length?`${project[1]} lists these API-related tools or integrations: ${apiTools.join(', ')}. The portfolio does not identify a more specific provider.`:`The portfolio does not list a specific API integration or provider for ${project[1]}. Its documented approach is: ${details[1]||description}`;
 }
 if(/\b(accuracy|accuracies|performance|results|score|scores|benchmark|benchmarks|roi|impact|improvement|improvements)\b/.test(questionIntent))
  return `The portfolio doesn't publish measured ${questionIntent.includes('accuracy')||questionIntent.includes('score')||questionIntent.includes('performance')?'scores':'results'} for ${project[1]}. It describes the project as: ${project[2]}`;
 if(asksTools&&project[5]==='Key capabilities')
  return `${project[1]} is described by these capabilities: ${project[3].join(', ')}. The portfolio doesn't specify an implementation stack or API provider. ${details[1]||''}`.trim();
 if(asksTools)return `${project[1]} lists: ${project[3].join(', ')}.${details[1]?` ${details[1]}`:''}`;
 const asksProcess=/\b(how|process|architecture|pipeline|approach|implement|implementation|works)\b/.test(questionIntent)||
  /\bworkflow\b/.test(questionIntent)&&/\b(describe|explain|what|which)\b/.test(questionIntent);
 if(asksProcess&&details[0])
  return `${project[1]}: ${details[0]}`;
 if(/\b(objective|purpose|goal|problem|why)\b/.test(questionIntent)&&details[0])
  return `${project[1]}: ${details[0]}`;
 if(details.length)
  return `${project[1]}: ${details.slice(0,2).join('\n\n')} Listed tools and capabilities: ${project[3].join(', ')}.`;
 return `${project[1]}: ${description} Listed tools and capabilities: ${project[3].join(', ')}.`;
}
function namedSkill(question){
 const query=normalize(question);
 const queryWords=words(query).filter(word=>!stopWords.has(word));
 const allSkills=skills.flatMap(group=>group[2].map(skill=>({skill,group:group[0]})));
 const paddedQuery=` ${query} `;
 return allSkills.find(item=>{const skill=normalize(item.skill);return skill.length>1&&paddedQuery.includes(` ${skill} `)})||
  allSkills.find(item=>{const skillWords=words(item.skill);return skillWords.length>0&&skillWords.every(word=>queryWords.includes(word))})||null;
}
function projectsUsing(skill){
 const key=normalize(skill);
 return projects.filter(project=>project[3].some(tool=>{
  const normalized=normalize(tool);
  const toolWords=words(normalized),skillWords=words(key);
  return normalized===key||(skillWords.length>0&&skillWords.every(word=>toolWords.includes(word)));
 }));
}
function skillsAnswer(question){
 const requested=namedSkill(question);
 if(requested){
  const matches=projectsUsing(requested.skill);
  return `Yes. ${requested.skill} is listed under ${requested.group}${matches.length?`; related projects include ${matches.slice(0,3).map(project=>project[1]).join(', ')}`:''}.`;
 }
 const terms=words(question).filter(word=>!stopWords.has(word));
 const groups=skills.filter(group=>terms.some(term=>normalize(group[0]).includes(term)));
 if(groups.length)return groups.slice(0,2).map(group=>`${group[0]}: ${group[2].slice(0,8).join(', ')}`).join('\n');
 return skills.slice(0,4).map(group=>`${group[0]}: ${group[2].slice(0,6).join(', ')}`).join('\n');
}
function servicesAnswer(){
 return `Muhammed offers ${svc.map(([name])=>name).join(', ').replace(/, ([^,]*)$/,' and $1')}.`;
}
function profileAnswer(){
 const current=currentRoles().map(job=>`${job[1]} at ${job[2]}`).join(' and ');
 const education=edu.slice(0,2).map(item=>item[1]).join(' and ');
 const areas=skills.slice(0,5).map(group=>group[0].toLowerCase()).join(', ');
 return `${profile.name} is an ${profile.role} based in ${profile.location}, with ${profile.years} of experience. Current roles listed: ${current}. His background includes data-science work, analytics training, freelance projects, and internships. Key areas include ${areas}; education includes ${education}. ${profile.availability}. ${contactAnswer()}`;
}
function technologyProjectsAnswer(question){
 const skill=namedSkill(question);
 if(!skill)return null;
 const matches=projectsUsing(skill.skill);
 if(!matches.length)return `${skill.skill} is listed in Muhammed's ${skill.group.toLowerCase()} skills. No project in the portfolio explicitly lists it in its tools.`;
 return `Projects listing ${skill.skill}: ${matches.slice(0,5).map(project=>project[1]).join(', ')}${matches.length>5?`, and ${matches.length-5} more`:''}.`;
}
function answer(question){
 const query=normalize(question);
 if(!query)return 'Ask me about Muhammed’s career, availability, skills, education, or projects.';
 if(/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(query))
  return `Hi, I'm Jahsh AI, your portfolio copilot. Ask me about ${profile.name}, his career, skills, projects, or availability.`;
 if(/\b(your name|who are you|what is his name|what s his name|bot name)\b/.test(query))
  return `I'm Jahsh AI, your portfolio copilot. I answer from ${profile.name}'s published portfolio.`;
 if(/\b(who is|about muhammad|about muhammed|about jahsh|introduce|tell me about him|profile|bio|background)\b/.test(query)&&!/\b(project|experience|career|skill|education)\b/.test(query))
  return profileAnswer();
 const exactProject=projects.find(item=>query.includes(normalize(item[1])));
 if(exactProject)return projectAnswer(exactProject,question);
 const followUpProject=lastProject&&/\b(it|its|this|that|they|their|the project)\b/.test(query)&&
  /\b(about|api|apis|audience|built|goal|how|objective|purpose|result|stack|technology|technologies|tool|tools|user|users|work|works)\b/.test(query);
 if(followUpProject)return projectAnswer(lastProject,question);
 if(/\b(available|availability|hire|hiring|freelance|freelancer|open to work|job opportunity|contact|email|phone|linkedin)\b/.test(query))
  return `${profile.availability}. ${contactAnswer()}`;
 if(/\b(education|degree|study|studied|qualification|university|college)\b/.test(query))
  return educationAnswer();
 if(/\b(certificate|certification|certifications|award|recognition)\b/.test(query))
  return certs.length?certs.slice(0,6).map(item=>item.slice(0,3).filter(Boolean).join(' · ')).join('\n'):unsupported('certifications or awards');
 const employerMentioned=jobs.some(job=>query.includes(normalize(job[2])));
 if(employerMentioned)
  return experienceAnswer(question);
 if(/\b(service|services|offer|offers|speciali[sz]e|help with)\b/.test(query))
  return servicesAnswer();
 if(/\b(end to end|full profile|complete profile|all about|professional summary|professional overview|tell me about myself|tell me about muhammed|tell me about jahsh)\b/.test(query))
  return profileAnswer();
 if(analyticsQuestion(query))return analyticsAnswer(question);
 const categoryAnswer=projectCategoryAnswer(question);
 if(categoryAnswer)return categoryAnswer;
 const project=projectMatch(question);
 if(project)return projectAnswer(project,question);
 if(/\b(which|what|show|list)\b/.test(query)&&/\b(projects|project|built with|using|use)\b/.test(query)){
  const matches=technologyProjectsAnswer(question);
  if(matches)return matches;
 }
 if(namedSkill(question)&&/\b(skill|skills|technology|technologies|stack|tool|tools|know|proficient|expertise|framework|experience)\b/.test(query))
  return skillsAnswer(question);
 if(/\b(experience|career|background|role|roles|work history|worked|employer|company|companies|trainer|training)\b/.test(query))
  return experienceAnswer(question);
 if(/\b(project|projects|portfolio|built|build|work samples)\b/.test(query)){
  const recent=projects.slice(0,5).map(project=>project[1]).join(', ');
  return `${projects.length} projects are listed across AI, automation, computer vision, fintech, and analytics. Recent examples: ${recent}. Ask about a project by name for a summary.`;
 }
 if(/\b(skill|skills|technology|technologies|stack|tool|tools|know|proficient|expertise|framework|api|apis)\b/.test(query))
  return skillsAnswer(question);
 if(/\b(location|where|based|live|from)\b/.test(query))
  return `${profile.name} is based in ${profile.location}.`;
 if(/\b(github|source code|repositories)\b/.test(query))
  return `GitHub profile: ${GH}`;
 return unsupported(question);
}
function submit(text){
 const question=text.trim();
 if(!question)return;
 addMessage(question,'user');
 prompts.hidden=true;
 input.value='';
 addMessage(answer(question),'assistant');
 input.focus();
}
toggle.addEventListener('click',()=>{
 const opening=panel.hidden;
 panel.hidden=!opening;
 toggle.setAttribute('aria-expanded',String(opening));
 if(opening)input.focus();
});
close.addEventListener('click',()=>{
 panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus();
});
form.addEventListener('submit',event=>{
 event.preventDefault();submit(input.value);
});
prompts.addEventListener('click',event=>{
 const button=event.target.closest('button');
 if(button)submit(button.textContent);
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!panel.hidden){panel.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.focus()}
});
})();
