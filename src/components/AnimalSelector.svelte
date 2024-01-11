<script>
  import { sexes } from "$lib/constants";
  export let selectedSex;

  let sexDropdownOpen = false;
  let sexValue = sexes.any;

  $: selectedSex = Object.values(sexes).find((s) => s === sexValue) ?? null;

  function toggleSexDropdown() {
    sexDropdownOpen = !sexDropdownOpen;
  }

  function handleSexDropdown(event) {
    sexValue = event.target.innerText;
    sexDropdownOpen = false;
  }
</script>

<div class="flex relative space-x-4 items-baseline">
  <p class="text-sm text-muted-foreground">Sexe</p>
  <div class="mb-4">
    <button
      on:click={toggleSexDropdown}
      class="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      type="button"
      >{sexValue}<svg
        class="w-2.5 h-2.5 ms-3"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      hidden={!sexDropdownOpen}
      class="z-10 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
    >
      <ul
        class="py-2 text-sm text-gray-700 dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        {#each Object.values(sexes) as sex}
          <li>
            <button
              on:click={handleSexDropdown}
              class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {sex}
            </button>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>
