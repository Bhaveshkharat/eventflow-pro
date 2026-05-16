import fs from 'fs';
const path = 'c:/EventFlow/eventflow-pro/src/app/organizer/participants/page.tsx';
let content = fs.readFileSync(path, 'utf8');
const target = '                    <div className="space-y-2">';
const replacement = `                     {selectedParticipant.companyInfo && (
                        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-3 mt-4">
                           <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                             Corporate Credentials
                           </span>
                           <div className="grid grid-cols-2 gap-3 font-mono">
                              <div>
                                 <span className="text-[9px] text-muted-foreground block font-sans uppercase">Designation</span>
                                 <span className="font-bold text-foreground truncate block">{selectedParticipant.companyInfo.designation}</span>
                              </div>
                              <div>
                                 <span className="text-[9px] text-muted-foreground block font-sans uppercase">Company Contact</span>
                                 <span className="font-bold text-foreground truncate block">{selectedParticipant.companyInfo.companyContact}</span>
                              </div>
                           </div>
                        </div>
                     )}

                     <div className="space-y-2">`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(path, content);
    console.log('Successfully updated file.');
} else {
    console.error('Target not found.');
    // List first few chars of lines around 630
    const lines = content.split('\n');
    console.log('Line 630:', JSON.stringify(lines[629]));
}
