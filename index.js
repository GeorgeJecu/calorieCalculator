let url =
  "https://caloriescount-7626f-default-rtdb.europe-west1.firebasedatabase.app/";
let currentUserID = "";
let currentUser = {};
const changeCard = (par) => {
  let stats = document.querySelector(".stats");
  let button1 = document.querySelector("#stats");
  let macro = document.querySelector(".macronutrients");
  let button2 = document.querySelector("#macro");

  if (par === "stats") {
    if (stats.classList.contains("hidden")) {
      stats.classList.remove("hidden");
      macro.classList.add("hidden");
      button1.classList.add("active");
      button2.classList.remove("active");
    }
  } else {
    getMacros();
    if (macro.classList.contains("hidden")) {
      macro.classList.remove("hidden");
      stats.classList.add("hidden");
      button2.classList.add("active");
      button1.classList.remove("active");
    }
  }
};

const getMacros = async () => {
  const response = await fetch(url + ".json");
  let macronutrients = await response.json();

  for (let [i, stat] of Object.entries(macronutrients)) {
    let maintainWeightValueSelect = stat.macros.maintainWeightValueSelect;
    console.log(maintainWeightValueSelect);

    let userKcal = stat.macros.userKcal;
    let targetKcal =
      Number(stat.macros.targetKcal) +
      Number(stat.macros.maintainWeightValueSelect);
    let kcalProgress = Math.round((userKcal * 100) / targetKcal);
    kcalProgress = kcalProgress.toString();

    let userProtein = stat.macros.userProtein;
    let targetProtein = stat.macros.targetProtein;
    let proteinProgress = Math.round((userProtein * 100) / targetProtein);
    proteinProgress = proteinProgress.toString();

    let userCarbohydrates = stat.macros.userCarbohydrates;
    let targetCarbohydrates = stat.macros.targetCarbohydrates;
    let carbohydratesProgress = Math.round(
      (userCarbohydrates * 100) / targetCarbohydrates
    );
    carbohydratesProgress = carbohydratesProgress.toString();

    let userFats = stat.macros.userFats;
    let targetFats = stat.macros.targetFats;
    let fatsProgress = Math.round((userFats * 100) / targetFats);
    fatsProgress = fatsProgress.toString();

    document
      .querySelector(`[value="${maintainWeightValueSelect}"]`)
      .setAttribute("selected", "selected");
    document.querySelector(".progress-barKcal").style.width =
      kcalProgress + "%";
    document.querySelector(".progress-barProtein").style.width =
      proteinProgress + "%";
    document.querySelector(".progress-barCarbohydrates").style.width =
      carbohydratesProgress + "%";
    document.querySelector(".progress-barFats").style.width =
      fatsProgress + "%";

    document.querySelector("#userKcal").innerHTML = userKcal;
    document.querySelector("#targetKcal").innerHTML = targetKcal;

    document.querySelector("#userProtein").innerHTML = userProtein;
    document.querySelector("#targetProtein").innerHTML = targetProtein;

    document.querySelector("#userCarbohydrates").innerHTML = userCarbohydrates;
    document.querySelector("#targetCarbohydrates").innerHTML =
      targetCarbohydrates;

    document.querySelector("#userFats").innerHTML = userFats;
    document.querySelector("#targetFats").innerHTML = targetFats;
  }
};

const newUser = (event) => {
  event.preventDefault();
  const userName = document.querySelector("#username").value;

  const age = document.querySelector("#age").value;

  const gender = document.querySelector("[name=gender]:checked").value;

  const height = document.querySelector("#height").value;

  const weight = document.querySelector("#weight").value;

  const activityValue = document.querySelector("select").value;

  const selectOption = document.querySelector("select");

  const activityName = selectOption.options[selectOption.selectedIndex].text;

  const basalMetabolicRate = 10 * weight + 6.25 * height - 5 * age + 5;

  const maintainWeightValue = Math.round(activityValue * basalMetabolicRate);

  errorCheck(
    userName,
    age,
    gender,
    height,
    weight,
    activityValue,
    activityName,
    basalMetabolicRate,
    maintainWeightValue
  );
};

const errorCheck = async (
  userName,
  age,
  gender,
  height,
  weight,
  activityValue,
  activityName,
  basalMetabolicRate,
  maintainWeightValue
) => {
  let error;
  if (userName.length < 2) {
    document.querySelector("#username").classList.add("error");
    error = true;
  }
  if (age.length < 2) {
    document.querySelector("#age").classList.add("error");
    error = true;
  }

  if (height.length < 3) {
    document.querySelector("#height").classList.add("error");
    error = true;
  }
  if (weight.length < 2) {
    document.querySelector("#weight").classList.add("error");
    error = true;
  }
  if (error === true) {
    return;
  } else {
    let targetKcal = maintainWeightValue;
    let targetProtein = Math.round(weight * 1.6);
    let targetFats = Math.round((targetKcal * 0.3) / 9);
    let targetCarbohydrates = Math.round(
      (targetKcal - (targetProtein * 4 + targetFats * 9)) / 4
    );
    let newUser = {
      userName: userName,
      age: age,
      gender: gender,
      height: height,
      weight: weight,
      activityValue: activityValue,
      activityName: activityName,
      macros: {
        maintainWeightValueSelect: 0,
        basalMetabolicRate: basalMetabolicRate,
        targetKcal: targetKcal,
        userKcal: 0,
        targetProtein: targetProtein,
        userProtein: 0,
        targetCarbohydrates: targetCarbohydrates,
        userCarbohydrates: 0,
        targetFats: targetFats,
        userFats: 0,
      },
    };

    const response = await fetch(url + ".json", {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  document.querySelector(".registerPage").classList.add("hidden");
  document.querySelector(".mainPage").classList.remove("hidden");

  await getUser();
};

const getUser = async () => {
  document
    .querySelector(".registerPage")
    .setAttribute("onSubmit", `newUser(event)`);

  const response = await fetch(url + ".json");
  currentUser = await response.json();
  if (currentUser == null) {
    // Firebase is empty!!
    document.querySelector(".registerPage").classList.remove("hidden");
    document.querySelector(".mainPage").classList.add("hidden");
  } else {
    document.querySelector(".registerPage").classList.add("hidden");
    document.querySelector(".mainPage").classList.remove("hidden");
  }

  assignUser();
};

const assignUser = () => {
  for (let [i, stat] of Object.entries(currentUser)) {
    let activityValue = stat.activityValue;
    let age = stat.age;
    let gender = stat.gender;
    let height = stat.height;
    let userName = stat.userName;
    let weight = stat.weight;
    let activityName = stat.activityName;

    document.querySelector(".card-title").innerHTML = userName;
    document.querySelector(".age").innerHTML = age;
    document.querySelector(".weight").innerHTML = weight;
    document.querySelector(".activity").innerHTML = activityName;
  }
};

const clearError = (par) => {
  document.querySelector(`#${par}`).classList.remove("error");
};

const editStats = () => {
  document.querySelector(".registerPage").classList.remove("hidden");
  document.querySelector(".mainPage").classList.add("hidden");

  for (let [i, stat] of Object.entries(currentUser)) {
    let activityValue = stat.activityValue;
    let age = stat.age;
    let gender = stat.gender;
    let height = stat.height;
    let userName = stat.userName;
    let weight = stat.weight;
    let activityName = stat.activityName;

    document.querySelector("#username").value = userName;
    document.querySelector("#age").value = age;
    document.querySelector("#height").value = height;
    document.querySelector("#weight").value = weight;
    document
      .querySelector(`[value="${activityValue}"]`)
      .setAttribute("selected", "selected");

    document
      .querySelector(".registerPage")
      .setAttribute("onSubmit", "saveNewStats(event)");
  }
};

const saveNewStats = async (event) => {
  event.preventDefault();
  const userName = document.querySelector("#username").value;

  const age = document.querySelector("#age").value;

  const gender = document.querySelector("[name=gender]:checked").value;

  const height = document.querySelector("#height").value;

  const weight = document.querySelector("#weight").value;

  const activityValue = document.querySelector("select").value;

  const selectOption = document.querySelector("#registerSelect");

  const activityName = selectOption.options[selectOption.selectedIndex].text;

  let error;
  if (userName.length < 2) {
    document.querySelector("#username").classList.add("error");
    error = true;
  }
  if (age.length < 2) {
    document.querySelector("#age").classList.add("error");
    error = true;
  }

  if (height.length < 3) {
    document.querySelector("#height").classList.add("error");
    error = true;
  }
  if (weight.length < 2) {
    document.querySelector("#weight").classList.add("error");
    error = true;
  }
  if (error === true) {
    return;
  } else {
    let editedUser = {
      userName: userName,
      age: age,
      gender: gender,
      height: height,
      weight: weight,
      activityValue: activityValue,
      activityName: activityName,
    };

    for (let [idx, stat] of Object.entries(currentUser)) {
      const response = await fetch(url + idx + ".json", {
        method: "PUT",
        body: JSON.stringify(editedUser),
        headers: {
          "Content-Type": "application/json",
        },
      });
      // console.log(response);
    }
    document.querySelector(".registerPage").classList.add("hidden");
    document.querySelector(".mainPage").classList.remove("hidden");

    await getUser();
  }
};

const saveMacros = async (event) => {
  event.preventDefault();
  const responseGet = await fetch(url + ".json");
  let user = await responseGet.json();
  for (let [i, macro] of Object.entries(user)) {
    currentUserID = i;
    let dbProtein = macro.macros.userProtein;
    let dbCarbohydrates = macro.macros.userCarbohydrates;
    let dbFats = macro.macros.userFats;
    let dbKcal = macro.macros.userKcal;

    const selectOption = document.querySelector("#macroSelect");
    const weightTargetName =
      selectOption.options[selectOption.selectedIndex].text;
    const weightTargetValue = document.querySelector("#macroSelect").value;
    const protein = document.querySelector("#protein").value;
    const carbohydrates = document.querySelector("#carbohydrates").value;
    const fats = document.querySelector("#fats").value;

    let userProtein = Number(dbProtein) + Number(protein);
    let userCarbohydrates = Number(dbCarbohydrates) + Number(carbohydrates);
    let userFats = Number(dbFats) + Number(fats);
    let maintainWeightValueSelect = weightTargetValue;
    let userKcal =
      Number(dbKcal) +
      Number(protein) * 4 +
      Number(carbohydrates) * 4 +
      Number(fats) * 9;

    const responseProtein = await fetch(
      url + currentUserID + "/macros/userProtein.json",
      {
        method: "PUT",
        body: JSON.stringify(userProtein),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseCarbohydrates = await fetch(
      url + currentUserID + "/macros/userCarbohydrates.json",
      {
        method: "PUT",
        body: JSON.stringify(userCarbohydrates),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseFats = await fetch(
      url + currentUserID + "/macros/userFats.json",
      {
        method: "PUT",
        body: JSON.stringify(userFats),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseKcal = await fetch(
      url + currentUserID + "/macros/userKcal.json",
      {
        method: "PUT",
        body: JSON.stringify(userKcal),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseWeightValue = await fetch(
      url + currentUserID + "/macros/maintainWeightValueSelect.json",
      {
        method: "PUT",
        body: JSON.stringify(maintainWeightValueSelect),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // let targetFats = fats;

  // const response = await fetch(url + currentUserID + "/macros.json");
  // let obj = await response.json();
  // console.log(obj);

  document.querySelector("#protein").value = 0;
  document.querySelector("#carbohydrates").value = 0;
  document.querySelector("#fats").value = 0;

  await getMacros();
};

const resetMacros = async () => {
  for (let [i, macro] of Object.entries(currentUser)) {
    currentUserID = i;

    let userProtein = 0;
    const responseProtein = await fetch(
      url + currentUserID + "/macros/userProtein.json",
      {
        method: "PUT",
        body: JSON.stringify(userProtein),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let userCarbohydrates = 0;
    const responseCarbohydrates = await fetch(
      url + currentUserID + "/macros/userCarbohydrates.json",
      {
        method: "PUT",
        body: JSON.stringify(userCarbohydrates),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let userFats = 0;
    const responseFats = await fetch(
      url + currentUserID + "/macros/userFats.json",
      {
        method: "PUT",
        body: JSON.stringify(userFats),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let userKcal = 0;
    const responseKcal = await fetch(
      url + currentUserID + "/macros/userKcal.json",
      {
        method: "PUT",
        body: JSON.stringify(userKcal),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  await getMacros();
};
