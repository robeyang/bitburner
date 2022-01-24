/** @param {NS} ns **/
/** @param {import(".").NS } ns */

// const servers = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","max-hardware","harakiri-sushi","zer0","silver-helix","comptek","phantasy","avmnite-02h","I.I.I.I","lexo-corp","snap-fitness","unitalife","solaris","iron-gym","nectar-net","CSEC","neo-net","netlink","crush-fitness","summit-uni","omega-net","the-hub","johnson-ortho","rothman-uni","zb-institute","rho-construction","alpha-ent","galactic-cyber","deltaone","defcomm","zb-def","titan-labs","fulcrumtech","omnitek","b-and-a","fulcrumassets","clarkinc","The-Cave","4sigma","blade","nwo","powerhouse-fitness","ecorp","megacorp","helios","microdyne","icarus","infocomm","nova-med","applied-energetics","stormtech","kuai-gong",".","run4theh111z","vitalife","univ-energy","taiyang-digital","aerocorp","millenium-fitness","global-pharm","omnia","zeus-med","syscore","catalyst","aevum-police","darkweb"];

function DFS(ns, current, server, ret) {
    var servers = ns.scan(server);
    // ns.tprint("Current Node " + current + "'s neighbors: " + servers);

    for (var j=0; j< servers.length; j++) {
        if (current == servers[j]) continue;
        ret.push(servers[j]);
        DFS(ns, server, servers[j], ret);
    }
}

function listallservers(ns) {
    var ret = [];
    DFS(ns, "", "home", ret);
    return ret;
}

function showhelp (ns) {
	ns.tprint("Usage: \n");
	ns.tprint("  show_hosts.js    : show rooted and hackLevel < me.\n");
	ns.tprint("  show_hosts.js -a : show all servers.\n");
	ns.tprint("  show_hosts.js -s HOSTNAME : show HOSTNAME.\n");
}

export function main(ns) {
	var target_host = "";
	var show_hacked = true;

	// parsing args
	while (ns.args.length) {
		var command = ns.args.shift();
		if (command === '-h') {
			showhelp(ns);
			return;
		}

		if (command === '-s') {
			target_host = ns.args.shift();
			show_hacked = false;
		}

		if (command === '-a') {
			show_hacked = false;
			continue;
		}
	}

	var servers = listallservers(ns);

	var str = ns.sprintf(" %6s | %6s | %4s | %20s | %6s | %11s | %11s | %6s\n", 
						'ROOTED',  'H. LVL', 'RAM',  'HOSTNAME', 'HACK%', 
						'$ CASH', '$ MAX', 'sec. L.');
	ns.tprint(str);
	str = ns.sprintf(" %6s | %6s | %4s | %20s | %6s | %10s | %10s | %6s\n", 
					'------', '------', '----', '--------------------', '------', '-----------', '-----------', '------');
	ns.tprint(str);

	var count = 0;
	for (var i=0;i<servers.length;i++)
	{
		var target = servers[i];

		if (target_host !== "" && target_host != target ) {
			continue;
		}

		var chanceHack = ns.hackAnalyzeChance(target);
		var rooted = ns.hasRootAccess(target);
		var maxRam = ns.getServerMaxRam(target);
		var maxMoney = ns.getServerMaxMoney(target);
		var availableMoney = ns.getServerMoneyAvailable(target);
		var secLevel = ns.getServerSecurityLevel(target);			// Server Security Level
		var hackLevel = ns.getServerRequiredHackingLevel(target);

		// unit of money
		var strMaxMoney ;
		if (maxMoney/1000000 > 0) {
			strMaxMoney = ns.sprintf("$%9.1fm", maxMoney/1000000);
		} else if (maxMoney/1000 > 0) {
			strMaxMoney = ns.sprintf("$%9.1fk", maxMoney/1000);
		} else {
			strMaxMoney = ns.sprintf("$%9.1f ", maxMoney);
		}

		var strAvailableMoney ;
		if (availableMoney/1000000 > 0) {
			strAvailableMoney = ns.sprintf("$%9.1fm", availableMoney/1000000);
		} else if (availableMoney/1000 > 1000) {
			strAvailableMoney = ns.sprintf("$%9.1fk", availableMoney/1000);
		} else {
			strAvailableMoney = ns.sprintf("$%9.1f ", availableMoney);
		}

		if (show_hacked) {
			if (hackLevel > ns.getHackingLevel() && (ns.hasRootAccess(target) == false)) continue;
		}

		var str = ns.sprintf(" %6s | %6s | %4s | %20s | %5.2f%% | %9s | %9s | %6.2f\n", 
								rooted ,  hackLevel, maxRam,  target, chanceHack, 
								strAvailableMoney, strMaxMoney, secLevel);
		ns.tprint(str);

		count++;
	}

	ns.tprint("\n Total counts: " + count + "\n");
}
