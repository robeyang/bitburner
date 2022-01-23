/** @param {NS} ns **/
/** @param {import(".").NS } ns */
// version: 2022-01-24 v1
// GLOBALS
var debug = true;
var hostRooted = [];
var hostUnRooted = [];
var hostRootedWithZeroMoney = [];
var script_name = "h.js";
var script_4g = "h_4g.js"
var fileList = [script_name, script_4g];
var chanceToHack = 0.35;
var runningTime = 1000*60*10; // 1 hour check once, and deploy me to hacked hosts

export async function main(ns) {
//    const hackingLevel = ns.getHackingLevel();

    while (true)
    {
        hostRooted = [];
        hostUnRooted = [];
        hostRootedWithZeroMoney = [];
        // hack neighbor servers first
        await exploitNeighbors(ns);

        // run h.js on exploited hosts
        await hackme(ns);

        // sleep for a while and then try to hack and deploy new version of me again.
        await ns.sleep(1000);
    }
}

async function exploitNeighbors(ns) 
{
    var ret;
    var hosts = ns.scan();
    for (let i = 0; i < hosts.length; i++) {
        const target = hosts[i];
		if (debug) ns.tprint("DEBUG: Processing host '" + target + "'.");
        if (target == "home") continue;
        if (ns.hasRootAccess(target) == false) {
            if (ns.getServerRequiredHackingLevel(target) > ns.getHackingLevel()) {
                hostUnRooted.push(target);
				if (debug) ns.tprint("DEBUG: Unrooted host added '" + target + "'.");
                continue;
            }
			if (ns.fileExists("BruteSSH.exe", "home")) {
				ns.brutessh(target);
			}
			if (ns.fileExists("FTPCrack.exe", "home")) {
				ns.ftpcrack(target);
			}
			if (ns.fileExists("HTTPWorm.exe", "home")) {
				ns.httpworm(target);
			}
			if (ns.fileExists("SQLInject.exe", "home")) {
				ns.sqlinject(target);
			}
			if (ns.fileExists("relaySMTP.exe", "home")) {
				ns.relaysmtp(target);
			}
            try {
			    ns.nuke(target);
                /*
                if (ns.getServerMaxRam(target) >= 32) {
                    ns.installBackdoor(target); // Need 32GB RAM
                }
                */
            } catch (error) {
                ns.tprint("ERROR: nuke('" + target + "') failed.");
                ns.tprint("Error Description: " + error + "\n\n");
            }
        } // if ns.hasRootAccess

        if (ns.getServerMaxMoney(target) != 0 ) { 
            // rooted and has money
            hostRooted.push(target);
            if (debug) ns.tprint("DEBUG: Rooted with Money host added '" + target + "'.");
        }
        
        // checking if target is running me.
//        var scripts = ns.ps(target);
//        for (var script of scripts) {
//            if(script.filename === script_name) break;
//        }
//        ret = await ns.kill(script_name, target);
//        if (debug) ns.tprint("DEBUG: Killing fileList at '" + target + "'. Result: " + ret);

        ret = await ns.scp(fileList, ns.getHostname(), target);
        if (debug) ns.tprint("DEBUG: Copying fileList to '" + target + "'. Result: " + ret);
		
//        ret = ns.kill(script_name, target);
//        if (debug) ns.tprint("DEBUG: kill '" + script_name + "' at '" + target + "' result '" + ret + "'");

        await ns.sleep(100);
        var script_exec = "";
        if (ns.getServerMaxRam(target) <= 4) {
            script_exec = script_4g;
        } else {
            script_exec = script_name;
        }
        ns.exec(script_exec, target);
        if (debug) ns.tprint("DEBUG: Executing script '" + script_name+ "' on '" + target + "'.");
    } // for
}

async function hackme(ns)
{
    var startTime = Date.now();
    await ns.sleep(1000);
	while ((Date.now() - startTime) < runningTime)
	{
		var target = ns.getHostname();
		if (target == "home") {
            await ns.sleep(runningTime);
            break;
        }
        
    	var maxRam = ns.getServerMaxRam(target);
        var h_threads = maxRam / 8;
        // disable below line if hacked servers have multiple cores.
        h_threads = 1;
        
        /*
		var maxMoney = ns.getServerMaxMoney(target);
	    var counts = Math.ceil(ns.growthAnalyze(target, maxMoney / ns.getServerMoneyAvailable(target)));

        while (counts--) {
           await ns.grow(target);
        }
        */

		var chanceHack = ns.hackAnalyzeChance(target);
		while (chanceHack < chanceToHack)
		{
			await ns.weaken(target, { threads: h_threads });
		}
        
		let earnedMoney = await ns.hack(target, { threads: h_threads });
		// ns.tprint(target + "\t: maxMoney " + maxMoney + "\t; hacked Money: " + earnedMoney);
	}
    if (debug) ns.tprint("DEBUG: host '" + ns.getHostname() + "' exit hackme() loop.");
    await ns.sleep(100);
}