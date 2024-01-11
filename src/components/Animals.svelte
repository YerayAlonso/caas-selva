<script>
  import AnimalSelector from "$components/AnimalSelector.svelte";
  import CardAnimal from "$components/CardAnimal.svelte";
  import { sexes } from "$lib/constants";

  export let animals;

  let selectedSex = sexes.any;

  $: filteredAnimals =
    selectedSex !== sexes.any
      ? animals.filter((animal) => animal.sex === selectedSex.toLowerCase())
      : animals;
</script>

<h1 class="text-3xl text-center mb-8">
  {filteredAnimals.length} animals del Centre d'Acollida d'Animals a la Selva CAAS
</h1>

<AnimalSelector bind:selectedSex />

{#key filteredAnimals}
  <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
    {#each filteredAnimals as animal}
      <CardAnimal {animal} />
    {/each}
  </div>
{/key}
