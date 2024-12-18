const a = ` \`\`\`cpp
// Language: C++
#include<iostream>
#include<fstream>
using namespace std;
main()
{
    int rno, fee;
    char name[50];
    ifstream fin("d:/student.doc");
    fin>>rno>>name>>fee; //read data from the file student
    fin.close();
    cout<<endl<<rno<<"\t"<<name<<"\t"<<fee;
    return 0;
}
\`\`\` `;

const n = a.replace(/^```.*\n/g, "") // Remove the opening code block markers
  .replace(/^\/\/ Language: .*\n/g, "") // Remove the "Language" comment
  .replace(/```$/g, ""); // Remove the closing code block marker

console.log(n);
