const { Client, GatewayIntentBits, ChannelType, PermissionsBitField } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

client.once('ready', async () => {
    console.log(`Bot connecté : ${client.user.tag}`);
    const guild = client.guilds.cache.get(GUILD_ID);
    if (!guild) return;

    // 1. Création des Rôles
    const roleStaff = await guild.roles.create({ name: 'STAFF', color: 'Yellow', permissions: [PermissionsBitField.Flags.Administrator] });
    const roleDirecteur = await guild.roles.create({ name: 'Directeur', color: 'Red' });
    const roleAgent = await guild.roles.create({ name: 'Agent Immobilier', color: 'Blue' });
    const roleClient = await guild.roles.create({ name: 'Client', color: 'Green' });

    // Perms pour salons publics
    const publicPerms = [
        { id: guild.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory], deny: [PermissionsBitField.Flags.SendMessages] },
        { id: roleClient.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
        { id: roleAgent.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
        { id: roleStaff.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
    ];

    // Perms pour Administration
    const adminPerms = [
        { id: guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: roleAgent.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
        { id: roleDirecteur.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] },
        { id: roleStaff.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory] }
    ];

    // 2. Création Catégories et Salons
    const catClients = await guild.channels.create({ name: '🏠 | ESPACE CLIENTS', type: ChannelType.GuildCategory });
    await guild.channels.create({ name: '🏠-bienvenue', type: ChannelType.GuildText, parent: catClients, permissionOverwrites: publicPerms });
    await guild.channels.create({ name: '📢-annonces-ventes', type: ChannelType.GuildText, parent: catClients, permissionOverwrites: publicPerms });
    await guild.channels.create({ name: '🎫-prendre-rendez-vous', type: ChannelType.GuildText, parent: catClients, permissionOverwrites: publicPerms });
    await guild.channels.create({ name: '⭐-avis-clients', type: ChannelType.GuildText, parent: catClients, permissionOverwrites: publicPerms });

    const catImmo = await guild.channels.create({ name: '💼 | ESPACE IMMOBILIER', type: ChannelType.GuildCategory });
    await guild.channels.create({ name: '📜-catalogues-tarifs', type: ChannelType.GuildText, parent: catImmo, permissionOverwrites: publicPerms });
    await guild.channels.create({ name: '📸-photos-biens', type: ChannelType.GuildText, parent: catImmo, permissionOverwrites: publicPerms });

    const catHRP = await guild.channels.create({ name: '📂 | HRP', type: ChannelType.GuildCategory });
    await guild.channels.create({ name: '💬-discussion-hrp', type: ChannelType.GuildText, parent: catHRP, permissionOverwrites: publicPerms });
    await guild.channels.create({ name: '🎞️-media-hrp', type: ChannelType.GuildText, parent: catHRP, permissionOverwrites: publicPerms });

    const catAdmin = await guild.channels.create({ name: '🔒 | ADMINISTRATION', type: ChannelType.GuildCategory, permissionOverwrites: adminPerms });
    await guild.channels.create({ name: '📢-annonces-interne', type: ChannelType.GuildText, parent: catAdmin, permissionOverwrites: adminPerms });
    await guild.channels.create({ name: '💰-gestion-comptable', type: ChannelType.GuildText, parent: catAdmin, permissionOverwrites: adminPerms });
    await guild.channels.create({ name: '📝-compte-rendu-visites', type: ChannelType.GuildText, parent: catAdmin, permissionOverwrites: adminPerms });
    await guild.channels.create({ name: '⚖️-litiges-propriétaires', type: ChannelType.GuildText, parent: catAdmin, permissionOverwrites: adminPerms });

    const catVoc = await guild.channels.create({ name: '🔊 | SALONS VOCAUX', type: ChannelType.GuildCategory });
    await guild.channels.create({ name: '🔊-Accueil-Agence', type: ChannelType.GuildVoice, parent: catVoc });
    await guild.channels.create({ name: '🔊-Bureau-Agents', type: ChannelType.GuildVoice, parent: catVoc });
    await guild.channels.create({ name: '🔊-Salle-Réunion', type: ChannelType.GuildVoice, parent: catVoc });

    console.log("Configuration terminée.");
});

client.login(TOKEN);