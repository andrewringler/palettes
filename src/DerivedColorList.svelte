<script>
    import chroma from 'chroma-js';
    import Color from './Color.svelte';
    import { generateDerivedColors, DECIMAL_PLACES, lchPctRegex, colorModifierObjectToString } from './colorUtils';

    export let index;
    export let allColorRules;
    export let baseColor;
    $: colorRules = allColorRules[index]
    $: colors = generateDerivedColors(baseColor, colorRules)
    $: baseColor, colorRules, generateDerivedColors(baseColor, colorRules)
    
    let edit = false;
    let input;

    let colorString = '';

    function enterEditMode() {
        edit = true;
        colorString = colorRules.map(colorModifierObjectToString).join(', ');
        input.focus();
    }

    function stringToRule(s) {
        // LCH Percentage Modifier
        let modifiers = lchPctRegex.exec(s)
        if(modifiers && modifiers.length === 4) {
            let lch = { 
                l: (parseFloat(modifiers[1])/100.0).toFixed(DECIMAL_PLACES),
                c: (parseFloat(modifiers[2])/100.0).toFixed(DECIMAL_PLACES),
                h: (parseFloat(modifiers[3])/100.0).toFixed(DECIMAL_PLACES)
            }
            return lch
        }

        // Valid Color Entered Directly? convert it to a LCH percentage Modifier
        if(chroma.valid(s)) {
            let derivedColor = chroma(s);
            let derivedColorLCH = derivedColor.lch();
            let baseColorLCH = baseColor.lch();

            let lch = { 
                l: (derivedColorLCH[0]/baseColorLCH[0]).toFixed(DECIMAL_PLACES), 
                c: (derivedColorLCH[1]/baseColorLCH[1]).toFixed(DECIMAL_PLACES),
                h: (derivedColorLCH[2]/baseColorLCH[2]).toFixed(DECIMAL_PLACES)
            }
            return lch;
        }

        return undefined;
    }

    function exitEditMode() {
        edit = false;

        let newRules = colorString.split(/\s*[,|\s]\s*/).map(stringToRule).filter(r => r)

        setTimeout(() => {
            allColorRules[index] = newRules;
        }, 150)
    }

    function dragstart(event, index) {
        event.dataTransfer.setData('index', index);
    }

    function dragover(event) {
        event.dataTransfer.dropEffect = 'move';
    }

    function drop(event) {
        const index = event.dataTransfer.getData('index');
        const newIndex = findIndex(event.target);
        const col = colors.splice(index, 1, null)[0];
        colors.splice(newIndex, 0, col);
        colors = colors.filter(c => c !== null);
    }

    function findIndex(el) {
        const siblings = el.parentNode.children;
        for (let i=0; i<siblings.length; i++) {
            if (siblings[i] === el) return i;
        }
        return -1;
    }
</script>

<style>
    div.form-control {
        cursor: text;
        height: auto;
    }
    .hidden {
        position: absolute;
        opacity: 0;
        left: -99999px;
    }
    span.inv {
        display: inline-block;
        width: 60px;
        background: white;
        height: 100%;
        vertical-align: bottom;
    }
    .palette {
        background: #eee;
        padding: 10px;
        display: flex;
        height: 100px;
        width: 100%;
        margin-bottom: 10;
    }
    .step {
       height: 100%;
       display: block;
       flex-grow: 1;
    }
</style>

<div class="palette" style="margin-bottom: 10px">
    {#each colors as color}
    <div class="step" style="background-color: {color.hex()}"></div>
    {/each}
</div>

<input class:hidden={!edit} bind:this={input} type="text" class="form-control" bind:value={colorString} on:blur={exitEditMode}>
{#if !edit}
<div
    class="form-control"
    on:click={enterEditMode}>
    {#each colors as color,i}
        <Color bind:value={color} />
    {/each}
    <span class="inv"></span>
</div>
{/if}