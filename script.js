// Taxonomy Explained JavaScript

// Function to get descriptive explanations for taxonomic ranks
function getTaxonomyDescription(rank, value) {
    if (!value || value === 'N/A') return 'No data available';

    // Create Wikipedia link
    const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(value.replace(/ /g, '_'))}`;
        const valueLink = `<a href="${wikiUrl}" target="_blank" rel="noopener" style="color:#2980b9;text-decoration:underline">${value}</a>`; // Only show the taxon name as link text, no 'Wikipedia' or extra text

    const descriptions = {
        'domain': `${valueLink} - The highest rank in biological classification. Eukaryota includes all organisms with cells that have a nucleus.`,
        'kingdom': `${valueLink} - Kingdom groups organisms by major structural traits. Animalia includes multicellular animals that move and respond to their environment.`,
        'phylum': `${valueLink} - Phylum groups organisms by body plan and ancestry. Chordata includes animals with a notochord; Arthropoda have jointed limbs and exoskeletons.`,
        'class': `${valueLink} - Class divides phyla by shared features. Mammalia are warm-blooded vertebrates with hair; Aves are birds with feathers and eggs.`,
        'order': `${valueLink} - Order groups families with similar traits. Carnivora includes meat-eating mammals; Lamniformes are mackerel sharks.`,
        'family': `${valueLink} - Family groups closely related genera. Felidae is the cat family; Lamnidae is the mackerel shark family.`,
        'genus': `${valueLink} - Genus is a group of closely related species. It is the first part of the scientific name (e.g., Homo in Homo sapiens).`,
        'species': `${valueLink} - Species is the most specific rank. Members can interbreed and produce fertile offspring.`
    };

    return descriptions[rank] || `${valueLink} - Taxonomic classification at the ${rank} level.`;
}

// Fetch similar animals using Encyclopedia of Life API (better taxonomic data)
async function fetchSimilarExamples(paramName, key, excludeKey, contextData) {
    if (!excludeKey || !contextData || !contextData.key) {
        // fallback to curated list (old logic)
        const curated = {
            // Mammals
            'Mammalia': ['Lion', 'Tiger', 'Elephant', 'Whale', 'Bear', 'Wolf', 'Giraffe', 'Rhinoceros', 'Kangaroo', 'Bat', 'Otter', 'Sloth', 'Armadillo', 'Moose', 'Hedgehog', 'Platypus', 'Dolphin', 'Porcupine', 'Aardvark', 'Hyena', 'Mole'],
            'Primates': ['Chimpanzee', 'Gorilla', 'Orangutan', 'Lemur', 'Baboon', 'Marmoset', 'Tamarin', 'Capuchin', 'Saki', 'Spider Monkey', 'Howler Monkey', 'Mandrill', 'Colobus', 'Gibbon', 'Bonobo', 'Proboscis Monkey'],
            'Carnivora': ['Wolf', 'Bear', 'Lion', 'Tiger', 'Leopard', 'Hyena', 'Otter', 'Meerkat', 'Raccoon', 'Polar Bear', 'Red Panda', 'Badger', 'Wolverine', 'Civet', 'Fossa', 'Sea Lion', 'Walrus', 'Cheetah', 'Jaguar', 'Cougar'],
            'Cetacea': ['Blue Whale', 'Dolphin', 'Orca', 'Sperm Whale', 'Beluga', 'Narwhal', 'Fin Whale', 'Humpback Whale', 'Gray Whale', 'Minke Whale', 'Pilot Whale', 'Porpoise', 'Right Whale', 'Bowhead Whale'],
            'Hominidae': ['Chimpanzee', 'Gorilla', 'Orangutan', 'Bonobo', 'Human', 'Neanderthal', 'Denisovan'],
            'Homo': ['Neanderthal', 'Homo erectus', 'Homo habilis', 'Homo sapiens', 'Denisovan'],
            'Felis': ['Lion', 'Tiger', 'Leopard', 'Lynx', 'Cheetah', 'Jaguar', 'Domestic Cat', 'Puma', 'Caracal', 'Serval', 'Ocelot', 'Bobcat', 'Margay'],
            'Canis': ['Wolf', 'Coyote', 'Jackal', 'Dingo', 'Domestic Dog', 'Red Fox', 'Gray Fox', 'Arctic Fox', 'African Wild Dog', 'Maned Wolf'],
            'Ursus': ['Brown Bear', 'Polar Bear', 'American Black Bear', 'Asian Black Bear', 'Sloth Bear', 'Spectacled Bear', 'Sun Bear'],

            // Birds
            'Aves': ['Eagle', 'Sparrow', 'Penguin', 'Owl', 'Parrot', 'Crow', 'Flamingo', 'Peacock', 'Hawk', 'Duck', 'Goose', 'Swan', 'Woodpecker', 'Kingfisher', 'Vulture', 'Albatross', 'Pelican', 'Heron', 'Stork', 'Toucan'],
            'Passeriformes': ['Robin', 'Cardinal', 'Sparrow', 'Finch', 'Starling', 'Swallow', 'Wren', 'Blackbird', 'Thrush', 'Warbler', 'Bunting', 'Tit', 'Magpie', 'Jay', 'Nuthatch', 'Pipit'],
            'Falconiformes': ['Eagle', 'Hawk', 'Falcon', 'Kite', 'Osprey', 'Buzzard', 'Harrier', 'Caracara', 'Secretarybird'],

            // Fish
            'Actinopterygii': ['Tuna', 'Salmon', 'Bass', 'Cod', 'Trout', 'Perch', 'Pike', 'Swordfish', 'Herring', 'Anchovy', 'Mackerel', 'Grouper', 'Snapper', 'Anglerfish', 'Sturgeon', 'Eel', 'Flounder', 'Halibut'],
            'Chondrichthyes': ['Great White Shark', 'Hammerhead Shark', 'Manta Ray', 'Stingray', 'Sawfish', 'Angel Shark', 'Whale Shark', 'Tiger Shark', 'Bull Shark', 'Blue Shark', 'Goblin Shark', 'Basking Shark', 'Thresher Shark'],
            'Elasmobranchii': ['Tiger Shark', 'Bull Shark', 'Whale Shark', 'Sawfish', 'Blue Shark', 'Angel Shark', 'Manta Ray', 'Stingray', 'Goblin Shark'],
            'Lamniformes': ['Great White Shark', 'Mako Shark', 'Thresher Shark', 'Basking Shark', 'Goblin Shark', 'Salmon Shark', 'Porbeagle'],
            'Lamnidae': ['Great White Shark', 'Shortfin Mako', 'Longfin Mako', 'Salmon Shark', 'Porbeagle'],

            // Reptiles
            'Reptilia': ['Snake', 'Lizard', 'Turtle', 'Crocodile', 'Gecko', 'Chameleon', 'Iguana', 'Monitor Lizard', 'Skink', 'Boa', 'Python', 'Alligator', 'Garter Snake', 'Komodo Dragon', 'Tortoise', 'Anole'],
            'Squamata': ['Python', 'Gecko', 'Monitor Lizard', 'Iguana', 'Boa', 'Skink', 'Chameleon', 'Anole', 'Glass Lizard'],

            // Amphibians
            'Amphibia': ['Frog', 'Toad', 'Salamander', 'Newt', 'Caecilian', 'Tree Frog', 'Bullfrog', 'Axolotl', 'Glass Frog', 'Hellbender'],

            // Arthropods
            'Arthropoda': ['Spider', 'Crab', 'Butterfly', 'Beetle', 'Ant', 'Bee', 'Scorpion', 'Centipede', 'Millipede', 'Shrimp', 'Lobster', 'Grasshopper', 'Dragonfly', 'Mosquito', 'Fly', 'Tick', 'Mite'],
            'Insecta': ['Butterfly', 'Beetle', 'Ant', 'Bee', 'Dragonfly', 'Grasshopper', 'Mosquito', 'Fly', 'Wasp', 'Hornet', 'Firefly', 'Ladybug', 'Cicada', 'Termite', 'Earwig', 'Mayfly'],
            'Lepidoptera': ['Monarch Butterfly', 'Swallowtail', 'Cabbage White', 'Blue Morpho', 'Painted Lady', 'Admiral', 'Comma', 'Fritillary', 'Skipper', 'Sulphur'],
            'Coleoptera': ['Ladybug', 'Rhinoceros Beetle', 'Firefly', 'Weevil', 'Stag Beetle', 'Dung Beetle', 'Click Beetle', 'Leaf Beetle', 'Longhorn Beetle'],
            'Hymenoptera': ['Honey Bee', 'Ant', 'Wasp', 'Bumblebee', 'Hornet', 'Yellowjacket', 'Paper Wasp', 'Carpenter Bee'],
            'Diptera': ['House Fly', 'Mosquito', 'Fruit Fly', 'Crane Fly', 'Horse Fly', 'Robber Fly', 'Bee Fly', 'Black Fly'],

            // Mollusks
            'Mollusca': ['Octopus', 'Squid', 'Snail', 'Clam', 'Oyster', 'Scallop', 'Cuttlefish', 'Slug', 'Mussel', 'Abalone', 'Whelk', 'Limpet'],
            'Cephalopoda': ['Octopus', 'Squid', 'Cuttlefish', 'Nautilus', 'Vampire Squid', 'Argonaut'],

            // Cnidarians
            'Cnidaria': ['Jellyfish', 'Sea Anemone', 'Coral', 'Hydra', 'Portuguese Man o’ War', 'Box Jellyfish', 'Sea Pen', 'Sea Fan'],

            // Vertebrates
            'Chordata': ['Fish', 'Bird', 'Mammal', 'Reptile', 'Amphibian', 'Turtle', 'Snake', 'Lizard', 'Frog', 'Salamander'],

            // General kingdoms
            'Animalia': ['Lion', 'Eagle', 'Shark', 'Butterfly', 'Elephant', 'Penguin', 'Crocodile', 'Ant', 'Wolf', 'Tiger', 'Bear', 'Owl', 'Dolphin', 'Giraffe', 'Rhinoceros', 'Kangaroo', 'Bat', 'Otter', 'Sloth', 'Armadillo']
        };
        return curated[key] ? curated[key].slice(0, 10) : [];
    }

    try {
        // Use GBIF /species/{key}/related endpoint
        const gbifKey = contextData.key;
        const url = `https://api.gbif.org/v1/species/${gbifKey}/related`;
        const resp = await fetch(url);
        if (resp.ok) {
            const data = await resp.json();
            // Siblings are taxa at the same rank
            let siblings = Array.isArray(data.siblings) ? data.siblings : [];
            // Exclude the current taxon
            siblings = siblings.filter(s => s.key !== gbifKey);
            // Use canonicalName or scientificName
            const names = siblings.map(s => s.canonicalName || s.scientificName).filter(Boolean);
            if (names.length > 0) return names.slice(0, 4);
        }
    } catch (e) {
        // fallback below
    }

    // fallback to curated list if GBIF fails
    const curated = {
        'Mammalia': ['Lion', 'Tiger', 'Elephant', 'Whale'],
        'Primates': ['Chimpanzee', 'Gorilla', 'Orangutan', 'Lemur'],
        'Carnivora': ['Wolf', 'Bear', 'Lion', 'Tiger'],
        'Cetacea': ['Blue Whale', 'Dolphin', 'Orca', 'Sperm Whale'],
        'Hominidae': ['Chimpanzee', 'Gorilla', 'Orangutan', 'Bonobo'],
        'Homo': ['Neanderthal', 'Homo erectus', 'Homo habilis'],
        'Felis': ['Lion', 'Tiger', 'Leopard', 'Lynx'],
        'Canis': ['Wolf', 'Coyote', 'Jackal', 'Dingo'],
        'Aves': ['Eagle', 'Sparrow', 'Penguin', 'Owl'],
        'Reptilia': ['Snake', 'Lizard', 'Turtle', 'Crocodile'],
        'Amphibia': ['Frog', 'Toad', 'Salamander', 'Newt'],
        'Arthropoda': ['Spider', 'Crab', 'Butterfly', 'Beetle'],
        'Insecta': ['Butterfly', 'Beetle', 'Ant', 'Bee'],
        'Mollusca': ['Octopus', 'Squid', 'Snail', 'Clam'],
        'Chordata': ['Fish', 'Bird', 'Mammal', 'Reptile'],
        'Animalia': ['Lion', 'Eagle', 'Shark', 'Butterfly']
    };
    return curated[key] ? curated[key].slice(0, 4) : [];
}

// Get common name from Wikipedia API (more reliable than iNaturalist for many species)
async function getCommonNameFromWikipedia(scientificName) {
    if (!scientificName) return scientificName;
    
    try {
        const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(scientificName)}`;
        const resp = await fetch(searchUrl);
        
        if (resp.ok) {
            const data = await resp.json();
            if (data.title && data.title !== scientificName && !data.title.includes('(disambiguation)')) {
                return data.title;
            }
        }
        
        // Fallback: use the species name part
        const parts = scientificName.split(' ');
        return parts.length > 1 ? parts[1] : scientificName;
    } catch (e) {
        const parts = scientificName.split(' ');
        return parts.length > 1 ? parts[1] : scientificName;
    }
}

function drawConnectors() {
    const svg = document.getElementById('connectors-svg');
    const layout = document.querySelector('.taxonomy-layout');
    if (!svg || !layout) return;
    // Resize SVG to match layout size
    const layoutRect = layout.getBoundingClientRect();
    svg.setAttribute('width', layoutRect.width);
    svg.setAttribute('height', layoutRect.height);
    svg.style.width = layoutRect.width + 'px';
    svg.style.height = layoutRect.height + 'px';
    svg.innerHTML = '';
    const image = document.getElementById('animal-image');
    if (!image || image.style.display === 'none' || !image.src || image.src === '' || image.naturalWidth === 0) return;
    const imageRect = image.getBoundingClientRect();
    const sections = [
        'domain-section', 'kingdom-section', 'phylum-section', 'class-section',
        'order-section', 'family-section', 'genus-section', 'species-section'
    ];
    // All lines originate from the center of the image, relative to layout
    const imageCenterX = imageRect.left + imageRect.width / 2 - layoutRect.left;
    const imageCenterY = imageRect.top + imageRect.height / 2 - layoutRect.top;
    sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionRect = section.getBoundingClientRect();
            const endX = sectionRect.left + sectionRect.width / 2 - layoutRect.left;
            const endY = sectionRect.top + sectionRect.height / 2 - layoutRect.top;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', imageCenterX);
            line.setAttribute('y1', imageCenterY);
            line.setAttribute('x2', endX);
            line.setAttribute('y2', endY);
            line.setAttribute('stroke', '#2980b9');
            line.setAttribute('stroke-width', '4');
            line.setAttribute('fill', 'none');
            svg.appendChild(line);
        }
    });
}
window.addEventListener('resize', drawConnectors);
async function fetchTaxonomy() {
    try {
        const response = await fetch('https://api.gbif.org/v1/species/2436436');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        // Prepare descriptions and similar examples for each rank
        document.getElementById('domain-desc').textContent = getTaxonomyDescription('domain', 'Eukaryota');

        const kingdomText = getTaxonomyDescription('kingdom', data.kingdom);
        const phylumText = getTaxonomyDescription('phylum', data.phylum);
        const classText = getTaxonomyDescription('class', data.class);
        const orderText = getTaxonomyDescription('order', data.order);
        const familyText = getTaxonomyDescription('family', data.family);
        const genusText = getTaxonomyDescription('genus', data.genus);
        const speciesText = getTaxonomyDescription('species', data.species || data.canonicalName);

        // Fetch similar examples in parallel
        const [kingdomSim, phylumSim, classSim, orderSim, familySim, genusSim] = await Promise.all([
            fetchSimilarExamples('kingdom', data.kingdom, data.key, data),
            fetchSimilarExamples('phylum', data.phylum, data.key, data),
            fetchSimilarExamples('class', data.class, data.key, data),
            fetchSimilarExamples('order', data.order, data.key, data),
            fetchSimilarExamples('family', data.family, data.key, data),
            fetchSimilarExamples('genus', data.genus, data.key, data),
        ]);

        function withSimilar(text, sims) {
            if (!sims || sims.length === 0) return text;
            return text + '\nSimilar animals: ' + sims.map(s => s).join(', ');
        }

        document.getElementById('kingdom-desc').textContent = withSimilar(kingdomText, kingdomSim);
        document.getElementById('phylum-desc').textContent = withSimilar(phylumText, phylumSim);
        document.getElementById('class-desc').textContent = withSimilar(classText, classSim);
        document.getElementById('order-desc').textContent = withSimilar(orderText, orderSim);
        document.getElementById('family-desc').textContent = withSimilar(familyText, familySim);
        document.getElementById('genus-desc').textContent = withSimilar(genusText, genusSim);
        document.getElementById('species-desc').textContent = speciesText;
    } catch (error) {
        document.getElementById('domain-desc').textContent = 'Error loading data';
        document.getElementById('kingdom-desc').textContent = '';
        document.getElementById('phylum-desc').textContent = '';
    }
}
async function searchSpecies() {
    const name = document.getElementById('species-input').value.trim();
    if (!name) {
        document.getElementById('status-msg').textContent = 'Please enter a species name.';
        return;
    }
    document.getElementById('status-msg').textContent = 'Searching...';

    // Handle common pet names and typo corrections
    const commonNames = {
        'cat': 'Felis catus',
        'dog': 'Canis lupus familiaris',
        'labrador': 'Canis lupus familiaris',
        'horse': 'Equus caballus',
        'pig': 'Sus scrofa',
        'cow': 'Bos taurus',
        'chicken': 'Gallus gallus domesticus',
        'raccoon': 'Procyon lotor',
        'racoon': 'Procyon lotor',
        'racooon': 'Procyon lotor'
    };

    // Simple typo correction for 'raccoon'
    let inputLower = name.toLowerCase();
    let sciName = commonNames[inputLower] || name;

    try {
        // If not a common name, try iNaturalist with preference for mammals
        if (!commonNames[inputLower]) {
            const iNatUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(name)}&per_page=5`;
            const iNatResp = await fetch(iNatUrl);
            const iNatData = await iNatResp.json();

            if (iNatData.results && iNatData.results.length > 0) {
                // Prefer mammals for pet-like queries
                let bestMatch = iNatData.results[0];
                for (let result of iNatData.results) {
                    if (result.iconic_taxon_name === 'Mammalia' || 
                        result.ancestor_ids?.includes(40151)) { // Mammalia taxon ID
                        bestMatch = result;
                        break;
                    }
                }
                sciName = bestMatch.name || name;
            }
        }

        // Now search GBIF using the scientific name
        const gbifUrl = `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(sciName)}&rank=species&limit=10`;
        let gbifResp = await fetch(gbifUrl);
        if (!gbifResp.ok) throw new Error('Network response was not ok');
        let gbifData = await gbifResp.json();
        // Prefer exact scientific name match
        let result = null;
        if (gbifData.results && gbifData.results.length > 0) {
            result = gbifData.results.find(r => (r.canonicalName || r.scientificName || '').toLowerCase() === sciName.toLowerCase());
            if (!result) result = gbifData.results[0];
            let sciNameToShow = result.canonicalName || result.scientificName || '';
            if (/sp\./i.test(sciNameToShow) && commonNames[inputLower]) {
                // Retry with corrected name
                const gbifUrl2 = `https://api.gbif.org/v1/species/search?q=${encodeURIComponent(commonNames[inputLower])}&rank=species&limit=10`;
                gbifResp = await fetch(gbifUrl2);
                if (gbifResp.ok) {
                    gbifData = await gbifResp.json();
                    result = gbifData.results.find(r => (r.canonicalName || r.scientificName || '').toLowerCase() === commonNames[inputLower].toLowerCase());
                    if (!result && gbifData.results.length > 0) result = gbifData.results[0];
                    if (result) {
                        const speciesId = result.key;
                        fetchTaxonomyById(speciesId);
                        return;
                    }
                }
            }
            if (result) {
                const speciesId = result.key;
                fetchTaxonomyById(speciesId);
            }
        } else {
            document.getElementById('status-msg').textContent = 'Species not found.';
            document.getElementById('domain-desc').textContent = '';
            document.getElementById('kingdom-desc').textContent = '';
            document.getElementById('phylum-desc').textContent = '';
            document.getElementById('class-desc').textContent = '';
            document.getElementById('order-desc').textContent = '';
            document.getElementById('family-desc').textContent = '';
            document.getElementById('genus-desc').textContent = '';
            document.getElementById('species-desc').textContent = '';
        }
    } catch (error) {
        document.getElementById('status-msg').textContent = 'Error searching for species.';
    }
}
async function fetchTaxonomyById(speciesId) {
    setTimeout(drawConnectors, 300);
    async function fetchImage(scientificName) {
        const apiUrl = `https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(scientificName)}&rank=species&per_page=1`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.results && data.results.length > 0 && data.results[0].default_photo) {
                const img = document.getElementById('animal-image');
                img.onload = () => setTimeout(drawConnectors, 100);
                img.onerror = () => { img.style.display = 'none'; };
                img.src = data.results[0].default_photo.medium_url;
                img.style.display = 'block';
                img.alt = scientificName + ' image';
                return;
            }
            document.getElementById('animal-image').style.display = 'none';
        } catch (error) {
            document.getElementById('animal-image').style.display = 'none';
        }
    }
    try {
        document.getElementById('status-msg').textContent = 'Loading...';
        const response = await fetch(`https://api.gbif.org/v1/species/${speciesId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const sciName = data.canonicalName || data.scientificName || 'N/A';
        document.getElementById('scientific-name').textContent = sciName;
        fetchImage(sciName);

        // If any rank is missing, fetch parent data
        let taxonomy = {
            domain: 'Eukaryota',
            kingdom: data.kingdom,
            phylum: data.phylum,
            class: data.class,
            order: data.order,
            family: data.family,
            genus: data.genus,
            species: data.species || data.canonicalName
        };

        const missingRanks = Object.entries(taxonomy)
            .filter(([rank, value]) => !value || value === 'N/A')
            .map(([rank]) => rank)
            .filter(rank => rank !== 'domain' && rank !== 'species');

        if (missingRanks.length > 0) {
            const parentsResp = await fetch(`https://api.gbif.org/v1/species/${speciesId}/parents`);
            if (parentsResp.ok) {
                const parents = await parentsResp.json();
                // Fill missing ranks from parents array
                for (const parent of parents) {
                    if (parent.rank && parent.canonicalName) {
                        const rankLower = parent.rank.toLowerCase();
                        if (missingRanks.includes(rankLower)) {
                            taxonomy[rankLower] = parent.canonicalName;
                        }
                    }
                }
            }
        }

        // Fetch similar examples in parallel for each rank
        const [kingdomSim, phylumSim, classSim, orderSim, familySim, genusSim] = await Promise.all([
            fetchSimilarExamples('kingdom', taxonomy.kingdom, data.key, data),
            fetchSimilarExamples('phylum', taxonomy.phylum, data.key, data),
            fetchSimilarExamples('class', taxonomy.class, data.key, data),
            fetchSimilarExamples('order', taxonomy.order, data.key, data),
            fetchSimilarExamples('family', taxonomy.family, data.key, data),
            fetchSimilarExamples('genus', taxonomy.genus, data.key, data),
        ]);

        function withSimilar(text, sims) {
            if (!sims || sims.length === 0) return text;
            return text + '\n\nSimilar animals: ' + sims.join(', ');
        }

    document.getElementById('domain-desc').innerHTML = getTaxonomyDescription('domain', taxonomy.domain);
    document.getElementById('kingdom-desc').innerHTML = withSimilar(getTaxonomyDescription('kingdom', taxonomy.kingdom), kingdomSim);
    document.getElementById('phylum-desc').innerHTML = withSimilar(getTaxonomyDescription('phylum', taxonomy.phylum), phylumSim);
    document.getElementById('class-desc').innerHTML = withSimilar(getTaxonomyDescription('class', taxonomy.class), classSim);
    document.getElementById('order-desc').innerHTML = withSimilar(getTaxonomyDescription('order', taxonomy.order), orderSim);
    document.getElementById('family-desc').innerHTML = withSimilar(getTaxonomyDescription('family', taxonomy.family), familySim);
    document.getElementById('genus-desc').innerHTML = withSimilar(getTaxonomyDescription('genus', taxonomy.genus), genusSim);
    document.getElementById('species-desc').innerHTML = getTaxonomyDescription('species', taxonomy.species);
    document.getElementById('status-msg').textContent = '';
    setTimeout(drawConnectors, 100); // Redraw connectors after content changes
    } catch (error) {
        document.getElementById('scientific-name').textContent = '';
        document.getElementById('animal-image').style.display = 'none';
        document.getElementById('domain-desc').textContent = 'Error loading data';
        document.getElementById('kingdom-desc').textContent = '';
        document.getElementById('phylum-desc').textContent = '';
        document.getElementById('class-desc').textContent = '';
        document.getElementById('order-desc').textContent = '';
        document.getElementById('family-desc').textContent = '';
        document.getElementById('genus-desc').textContent = '';
        document.getElementById('species-desc').textContent = '';
        document.getElementById('status-msg').textContent = 'Error loading data';
    }
}
window.onload = function() {
    document.getElementById('scientific-name').textContent = 'Homo sapiens';
    fetchTaxonomyById(2436436); // Homo sapiens by default
    setTimeout(drawConnectors, 300);
};
