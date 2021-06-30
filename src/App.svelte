<script>
    import chroma from 'chroma-js';
    import { beforeUpdate, onMount } from 'svelte';
    import Checkbox from './Checkbox.svelte';
    import InputColors from './InputColors.svelte';
    import PalettePreview from './PalettePreview.svelte';
    import Export from './Export.svelte';
    import StepChart from './StepChart.svelte';
    import StepChart2 from './StepChart2.svelte';
    import Card from './Card.svelte';
    import ColorBlindCheck from './ColorBlindCheck.svelte';
    import ButtonGroup from './ButtonGroup.svelte';
    import ColorListReadOnly from './ColorListReadOnly.svelte';
    import DerivedColorList from './DerivedColorList.svelte';
    import { compactColorRulesString, compactColorRulesStringToColorRules } from './colorUtils';

    export let name;

    let steps = [];
    let bezier = true;
    let correctLightness = true;
    let generateSecondaryColors = false;

    let colors = '00429d,96ffea,lightyellow'.split(/\s*,\s*/).map(c => chroma(c));
    let colors2 = [];
    let numColors = 9;
    let mode = 'sequential';
    let arrangeBy = 'manual';
    let simulate = 'none';
    let secondaryColorRules = [];

    if (window.location.hash) {
        readStateFromHash();
    }

    $: hash = [
        numColors,
        mode.substr(0,1),
        colors.map(c=>c.hex().substr(1)).join(','),
        colors2.length ? colors2.map(c=>c.hex().substr(1)).join(',') : '',
        correctLightness ? 1:0,
        bezier ? 1:0,
        generateSecondaryColors ? 1:0,
        secondaryColorRules.length && generateSecondaryColors ? compactColorRulesString(secondaryColorRules) : ''
    ].join('|');

    $: bezierDisabled = (mode==='sequential' || mode==='manual') ? !(colors.length>1&&colors.length<=5) : !(colors2.length>1&&colors2.length<=5 || colors.length>1&&colors.length<=5);
    $: generateColorsDisabled = mode==='manual';
    $: numOutputColors = generateColorsDisabled ? colors.length : numColors;
    $: colors, arrangeBy, arrangeColors();
    $: outputColors = steps.map(step => chroma(step))

    $: outputColors, updateSecondaryColorRules()

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') > -1;

    let _hash = '';
    let _mounted = false;
    let _mode = 'sequential';

    beforeUpdate(() => {
        if (hash !== _hash) {
            _hash = hash;
            window.location.hash = `#/${hash}`;
        }
        if (mode !== _mode) {
            if (mode === 'diverging' && !colors2.length) {
                colors2 = colors.slice(0).reverse();
            }
            if (mode === 'sequential' || mode === 'manual') {
                colors2 = [];
            }
            _mode = mode;
        }
    });

    // onMount(() => {
    //     if (window.location.hash) {
    //         console.log('initial hash', window.location.hash);
    //         readStateFromHash();
    //     }
    //     _mounted = true;
// })

    function arrangeColors() {
        if(arrangeBy === 'manual' || mode === 'diverging') {
            return
        }

        setTimeout(() => {
            let colorsOld = [...colors];

            if(arrangeBy === 'lightness') {
                colors = colors.sort((a, b) => a.lch()[0] > b.lch()[0] ? 1 : -1)                
            }
            if(arrangeBy === 'chroma') {
                colors = colors.sort((a, b) => a.lch()[1] > b.lch()[1] ? 1 : -1)
            }
            if(arrangeBy === 'hue') {
                colors = colors.sort((a, b) => a.lch()[2] > b.lch()[2] ? 1 : -1)
            }

            // sort color rules by same metric, if lengths match
            if(colors.length === secondaryColorRules.length) {
                let sortOrder = colorsOld.map(oldColor => {
                    return colors.indexOf(oldColor);
                })
                let newSecondaryColorRules = [...secondaryColorRules];
                secondaryColorRules.forEach((rule, idx) => {
                    newSecondaryColorRules[sortOrder[idx]] = rule;
                })
                secondaryColorRules = newSecondaryColorRules;
            }
        }, 150)
    }

    function updateSecondaryColorRules() {
        if(secondaryColorRules.length === outputColors.length) {
            return; // all set
        }

        // Create new arrays of correct size filled with default rules
        let newSecondaryColorsRules = [];
        for(var i=0; i<outputColors.length; i++) {
            let rules = [];
            let numberOfColors = 3;
            if(Array.isArray(secondaryColorRules) && secondaryColorRules.length > i) {
                numberOfColors = secondaryColorRules[i].length;
            }
            for(var j=0; j<numberOfColors; j++) {
                let offset = (j+1)*1.1 / 10.0;
                rules.push({ l: (1 + offset).toFixed(1), c: (1 + offset/2.0).toFixed(1), h: 1 });
            }
            newSecondaryColorsRules.push(rules)
        }

        // Fill in any any existing old rules that have the same indices
        if(Array.isArray(secondaryColorRules)) {
            for(var i=0; i<outputColors.length; i++) {
                let rules = newSecondaryColorsRules[i];
                for(var j=0; j<rules.length; j++) {
                    let oldRule = secondaryColorRules.length > i && Array.isArray(secondaryColorRules[i]) && secondaryColorRules[i].length > j && secondaryColorRules[i][j]
                    if(typeof oldRules === 'object') {
                        rules[j] = oldRule;
                    }
                }
            }    
        }

        setTimeout(() => {
            secondaryColorRules = newSecondaryColorsRules;
        }, 150)
    }

    function readStateFromHash() {
        const parts = window.location.hash.substr(2).split('|');
        if (parts.length >= 6) {
            setTimeout(() => {
                numColors = +parts[0];
                mode = parts[1] === 's' ? 'sequential' : (parts[1] === 'd' ? 'diverging' : 'manual');
                _mode = mode;
                colors = parts[2].split(',').map(c => c && chroma(c));
                colors2 = parts[3] !== '' ? parts[3].split(',').map(c => c && chroma(c)) : [];
                correctLightness = parts[4] === '1';
                bezier = parts[5] === '1';
                generateSecondaryColors = parts.length >= 7 && parts[6] === '1';
                if(parts.length >= 8) {
                    secondaryColorRules = compactColorRulesStringToColorRules(parts[7]);
                }
            }, 150);
        } else {
            window.location.hash = '';
        }
    }

    function hashChange() {
        if (window.location.hash !== `#/${hash}`) {
            // deserialize hash
            readStateFromHash();
        }
    }
</script>

<style>
    .head {
        margin: 1em 0 1em;
    }
    h1 {
    }
    .warning {
      font-size: 0.8em;
      color: orange;
      font-weight: bold;
      display: block;
    }
    select.custom-select {
        display: inline-block;
        width: auto;
        font-size: inherit;
        padding: 0.4em 1.7em 0.4em 0.4em;
        margin: 0px 0.7ex 5px;
    }
    input[type=number] {
        width: 4em;
        text-align: center;
        margin: 0px 0.7ex 5px;
    }
    .foot {
        margin-bottom: 1em;
    }
    :global(.fa-svelte) {
        vertical-align: sub;
    }
    kbd
    {
        -moz-border-radius:3px;
        -moz-box-shadow:0 1px 0 rgba(0,0,0,0.2),0 0 0 2px #fff inset;
        -webkit-border-radius:3px;
        -webkit-box-shadow:0 1px 0 rgba(0,0,0,0.2),0 0 0 2px #fff inset;
        background-color:#f7f7f7;
        border:1px solid #ccc;
        border-radius:3px;
        box-shadow:0 1px 0 rgba(0,0,0,0.2),0 0 0 2px #fff inset;
        color:#333;
        display:inline-block;
        /*font-family:Arial,Helvetica,sans-serif;*/
        line-height:1.4;
        margin:0 .1em;
        padding:.1em .6em;
        text-shadow:0 1px 0 #fff;
    }
    .text-muted {
        font-size: 0.85rem;
        display: inline-block;
        padding-top: 6px;
    }
    .arrange-inputs {
        margin-top: 1rem;
    }
</style>

<svelte:window on:hashchange={hashChange} />

<div class="container">
    <div class="head">
        <h1>Data Color Palettes</h1>
        <p>This tools aids in generating perceptually meaningful and vision accessible color palettes for use in data visualization. Create sequential, <a target="_blank" href="http://vis4.net/blog/posts/mastering-multi-hued-color-scales/">multi-hued & multi-stop diverging</a> and qualitative color schemes.</p>
    </div>
    <Card step="1" title="What kind of palette do you want to create?">
        <div class="row">
            <div class="col-md">
                Palette type:
                <ButtonGroup options="{['sequential', 'diverging', 'manual']}" bind:value={mode} />
            </div>
            {#if generateColorsDisabled}
                <div class="col-md">
                    Number of colors: <input type="number" min="2" bind:value={numOutputColors} disabled />
                </div>
            {:else}
                <div class="col-md">
                    Number of colors: <input type="number" min="2" bind:value={numColors} />
                </div>
            {/if}
        </div>
    </Card>

    <Card step="2" title="Select and arrange input colors">
        <InputColors diverging="{mode==='diverging'}" bind:colors bind:colors2 />
            <div class="arrange-inputs">
                <span class="text-muted">Arrange by:</span> <ButtonGroup buttonSmall="{true}" options="{['manual', 'lightness', 'chroma', 'hue']}" bind:value={arrangeBy} />
            </div>
    </Card>

    <Card step="3" title="Check and configure the resulting palette">
        <div class="row" style="margin-bottom: 10px">
            <div class="col-md">
                <Checkbox bind:value={correctLightness} label="correct lightness" />
                <Checkbox bind:value={bezier} label="bezier interpolation" disabled={bezierDisabled} />
                {#if bezierDisabled}
                <span class="warning">* Bezier interpolation requires 2-5 input colors</span>
                {/if}
            </div>
            <div class="col-md">
                <ColorBlindCheck bind:colors={steps} bind:active={simulate} />
            </div>
        </div>
        <PalettePreview
            bind:steps
            bind:correctLightness
            bind:bezier
            bind:colors
            bind:colors2
            diverging="{mode === 'diverging'}"
            simulate={simulate}
            bind:numColors={numOutputColors} />
         <div class="row" style="margin: 10px 0 10px 0">
            <ColorListReadOnly bind:colors={outputColors} />
        </div>
        <div class="row">
            <div class="col-md">
                <StepChart title="lightness (LCH)" steps={steps} mode={0} />
            </div>
            <div class="col-md">
                <StepChart title="chroma (LCH)" steps={steps} mode={1} />
            </div>
            <div class="col-md">
                <StepChart title="hue (LCH)" steps={steps} mode={2} />
            </div>
            <div class="col-md">
                <StepChart title="saturation (HSL)" steps={steps} mode={3} />
            </div>
        </div>
    </Card>

    <Card step="4" title="Generate Secondary Palette Colors">
        <div>
            <Checkbox bind:value={generateSecondaryColors} label="generate secondary colors" />
        </div>
        {#if generateSecondaryColors}
            {#each outputColors as baseColor, i}
                <div class="row" style="margin: 10px 0 10px 0">
                    <DerivedColorList baseColor={baseColor} index={i} bind:allColorRules={secondaryColorRules} />
                </div>
            {/each}

            {#if Array.isArray(secondaryColorRules)}
            <div class="row">
                <div class="col-md">
                    <StepChart2 title="% change lightness (LCH)" values={secondaryColorRules} field="l" colors={outputColors} />
                </div>
                <div class="col-md">
                    <StepChart2 title="% change chroma (LCH)" values={secondaryColorRules} field="c" colors={outputColors} />
                </div>
                <div class="col-md">
                    <StepChart2 title="% change hue (LCH)" values={secondaryColorRules} field="h" colors={outputColors} />
                </div>
            </div>
            {/if}
        {/if}
    </Card>

    <Card step="5" title="Export the color codes in various formats">
        <p>You can also save your palette for later by bookmarking <a href="#/{hash}">this page</a> using <kbd>{isMac ? 'cmd' : 'ctrl'}</kbd>+<kbd>d</kbd>.</p>
        <Export steps={steps} />
    </Card>

    <div class="foot">
        <hr>
        <p>Check it out <a href="https://github.com/andrewringler/palettes">on Github</a></p>
        <p>Adpated by <a href="https://andrewringler.com/">Andrew Ringler</a> from <a href="https://github.com/gka/palettes">palettes</a>, originally created by <a href="https://vis4.net/blog">Gregor Aisch</a>.</p>
    </div>
</div>
