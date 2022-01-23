/** @param {NS} ns **/

/** @param {import(".").NS } ns */

// const servers = ["n00dles", "foodnstuff", "sigma-cosmetics", "hong-fang-tea", "harakiri-sushi", "CSEC", "neo-net", "harakiri-sushi", "nectar-net", "iron-gym", "phantasy", "zer0", "silver-helix"];

const servers = ["n00dles","foodnstuff","sigma-cosmetics","joesguns","hong-fang-tea","max-hardware","harakiri-sushi","zer0","silver-helix","comptek","phantasy","avmnite-02h","I.I.I.I","lexo-corp","snap-fitness","unitalife","solaris","iron-gym","nectar-net","CSEC","neo-net","netlink","crush-fitness","summit-uni","omega-net","the-hub","johnson-ortho","rothman-uni","zb-institute","rho-construction","alpha-ent","galactic-cyber","deltaone","defcomm","zb-def","titan-labs","fulcrumtech","omnitek","b-and-a","fulcrumassets","clarkinc","The-Cave","4sigma","blade","nwo","powerhouse-fitness","ecorp","megacorp","helios","microdyne","icarus","infocomm","nova-med","applied-energetics","stormtech","kuai-gong",".","run4theh111z","vitalife","univ-energy","taiyang-digital","aerocorp","millenium-fitness","global-pharm","omnia","zeus-med","syscore","catalyst","aevum-police","darkweb","home1"];

export async function main(ns) {
	// var	target = ns.args[0];

	ns.tprint("ROOTED\t| HACK LVL\t | MAX RAM \t| HOSTNAME\t | HACK CHANCE % \t| MAX $$ \t| CASH $$ \t | sec Min Level \t| sec Level\n");

	var count = 0;
	for (var i=0;i<servers.length;i++)
	{
		var target = servers[i];

		var chanceHack = ns.hackAnalyzeChance(target);
		var rooted = ns.hasRootAccess(target);
		var maxRam = ns.getServerMaxRam(target);
		var maxMoney = ns.getServerMaxMoney(target);
		var availableMoney = ns.getServerMoneyAvailable(target);
		var secLevel = ns.getServerSecurityLevel(target);
		var secMinLevel = ns.getServerMinSecurityLevel(target);
		var hackLevel = ns.getServerRequiredHackingLevel(target);

		if (hackLevel > ns.getHackingLevel() && (ns.hasRootAccess(target) == false)) continue;
		ns.tprint(rooted+ "\t| " + hackLevel + "\t|" + maxRam + "\t|" + target + "\t| " + chanceHack + "\t|" + maxMoney + "\t|" + availableMoney + "\t|" + secMinLevel + "\t|" + secLevel +"\n");
		count++;
	}

	ns.tprint("\n Total counts: " + count + "\n");
}
