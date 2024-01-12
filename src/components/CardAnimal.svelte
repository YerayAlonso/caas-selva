<script>
  export let animal;

  const { name, image, adoptable, breed, sex, age } = animal;
  const adoptableText = adoptable ? "Adoptable" : "No adoptable";
</script>

<a
  href="animal/${name}"
  class="rounded-lg border shadow-md bg-gray-800 border-gray-700 hover:scale-105 hover:bg-gray-700 hover:border-gray-500 transition flex flex-col"
>
  <picture class="flex justify-center p-4">
    <img
      id="animal-image"
      class="rounded-lg aspect-[4/3] object-cover"
      src={image}
      alt="Animal ${name}"
      onerror="this.onerror=null;this.src='/generic-dog.png';this.classList.add('bg-slate-500/80')"
    />
  </picture>

  <header class="p-4">
    <span
      class="text-xs font-semibold mr-2 px-2.5 py-0.5 rounded
        {adoptable ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'}"
    >
      {adoptableText}
    </span>

    <h2 class="my-2 text-2xl font-bold tracking-tight white">{name}</h2>
    <p class="font-light text-gray-400">{breed}</p>
    <p class="font-light text-gray-400">{sex}</p>
    <p class="font-light text-gray-400">{age}</p>
  </header>
</a>
