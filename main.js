let selectedSkills = {
    player1: null,
    player2: null,
    player3: null,
    player4: null
  };
  
  const allies = [
    { name: '전사', key: 'player1', speed: 12, sprite: null, hp: 100, maxHp: 100, attackPower: 12, healPower: 38 },
    { name: '드래곤', key: 'player2', speed: 20, sprite: null, hp: 100, maxHp: 100, attackPower: 10, healPower: 40 },
    { name: '마녀', key: 'player3', speed: 18, sprite: null, hp: 100, maxHp: 100, attackPower: 20, healPower: 30 },
    { name: '소환사', key: 'player4', speed: 14, sprite: null, hp: 100, maxHp: 100, attackPower: 25, healPower: 25 }
  ];
  
  const enemies = [
    { name: '나방 A', speed: 7, sprite: null, hp: 100, maxHp: 100, attackPower: 18, healPower: 52 },
    { name: '나방 B', speed: 15, sprite: null, hp: 100, maxHp: 100, attackPower: 28, healPower: 32 },
    { name: '나방 C', speed: 21, sprite: null, hp: 100, maxHp: 100, attackPower: 35, healPower: 15 }
  ];
  
  let currentScene = null;
  
  function log(msg) {
    const logDiv = document.getElementById('log');
    logDiv.innerHTML += `🗡️ ${msg}<br>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }
  
  function updateSkillSummary() {
    const summaryDiv = document.getElementById('skill-summary');
    summaryDiv.innerHTML = '';
  
    for (let key in selectedSkills) {
      const skill = selectedSkills[key];
      const ally = allies.find(a => a.key === key);
      const text = ally.hp <= 0
        ? `${ally.name}: 사망`
        : skill
        ? `${ally.name}: ${skill.name}`
        : `${ally.name}: 선택 안 함`;
      summaryDiv.innerHTML += `🧠 ${text}<br>`;
    }
  }
  
  function getRandomEnemySkill(enemy) {
    const hpRatio = enemy.hp / enemy.maxHp;
    const healChance = (1 - hpRatio) * 100;
    const rand = Phaser.Math.Between(0, 100);
  
    if (rand < healChance) {
      return { name: '회복', damage: 0, heal: enemy.healPower };
    } else {
      return { name: '공격', damage: enemy.attackPower, heal: 0 };
    }
  }
  
  const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    scene: {
      preload,
      create,
      update
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player1', 'assets/player.png');
    this.load.image('player2', 'assets/dragon.png');
    this.load.image('player3', 'assets/witch.png');
    this.load.image('player4', 'assets/summoner.png');
    this.load.image('enemy', 'assets/enemy.png');
  }
  
  function create() {
    currentScene = this;
    this.add.image(400, 300, 'background');
  
    for (let ally of allies) {
      ally.sprite = this.add.sprite(100, 100 + allies.indexOf(ally) * 100, ally.key);
      ally.sprite.setFlipX(true);
      ally.originalX = ally.sprite.x;
  
      ally.hpBarBg = this.add.rectangle(ally.sprite.x, ally.sprite.y - 50, 60, 10, 0x333333);
      ally.hpBar = this.add.rectangle(ally.sprite.x, ally.sprite.y - 50, 60, 10, 0x44ff44);
    }
  
    for (let enemy of enemies) {
      enemy.sprite = this.add.sprite(500 + enemies.indexOf(enemy) * 100, 150 + enemies.indexOf(enemy) * 150, 'enemy');
      enemy.sprite.setScale(0.2);
      enemy.originalX = enemy.sprite.x;
  
      enemy.hpBarBg = this.add.rectangle(enemy.sprite.x, enemy.sprite.y - 50, 60, 10, 0x333333);
      enemy.hpBar = this.add.rectangle(enemy.sprite.x, enemy.sprite.y - 50, 60, 10, 0xff4444);
    }
  }
  // ... (앞부분 allies, enemies, preload, create 등은 그대로 유지)

function update() {}

function log(msg) {
  const logDiv = document.getElementById('log');
  logDiv.innerHTML += `🗡️ ${msg}<br>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}

function updateSkillSummary() {
  const summaryDiv = document.getElementById('skill-summary');
  summaryDiv.innerHTML = '';

  for (let key in selectedSkills) {
    const skill = selectedSkills[key];
    const ally = allies.find(a => a.key === key);
    const text = ally.hp <= 0
      ? `${ally.name}: 사망`
      : skill
      ? `${ally.name}: ${skill.name}`
      : `${ally.name}: 선택 안 함`;
    summaryDiv.innerHTML += `🧠 ${text}<br>`;
  }
}

function getRandomEnemySkill(enemy) {
  const hpRatio = enemy.hp / enemy.maxHp;
  const healChance = (1 - hpRatio) * 100;
  const rand = Phaser.Math.Between(0, 100);

  if (rand < healChance) {
    return { name: '회복', damage: 0, heal: enemy.healPower };
  } else {
    return { name: '공격', damage: enemy.attackPower, heal: 0 };
  }
}

window.selectSkill = function (playerKey, skillName) {
  const ally = allies.find(a => a.key === playerKey);
  if (ally.hp <= 0) {
    alert(`${ally.name}은 사망하여 스킬을 선택할 수 없습니다.`);
    return;
  }

  const skill = {
    name: skillName,
    damage: skillName === '공격' ? ally.attackPower : 0,
    heal: skillName === '회복' ? ally.healPower : 0
  };

  selectedSkills[playerKey] = skill;
  log(`${ally.name}의 스킬 선택: ${skillName}`);
  updateSkillSummary();
};

window.endTurn = function () {
  const livingAllies = allies.filter(a => a.hp > 0);
  const notSelected = livingAllies.some(a => selectedSkills[a.key] === null);

  if (notSelected) {
    alert("모든 생존 캐릭터의 스킬을 선택해주세요!");
    return;
  }

  const allyActions = livingAllies.map(ally => ({
    name: ally.name,
    speed: ally.speed,
    skill: selectedSkills[ally.key],
    sprite: ally.sprite,
    type: 'ally',
    unit: ally
  }));

  const enemyActions = enemies.filter(e => e.hp > 0).map(enemy => ({
    name: enemy.name,
    speed: enemy.speed,
    skill: getRandomEnemySkill(enemy),
    sprite: enemy.sprite,
    type: 'enemy',
    unit: enemy
  }));

  const allActions = [...allyActions, ...enemyActions].sort((a, b) => b.speed - a.speed);

  let i = 0;
  function executeNext() {
    if (i >= allActions.length) {
      log("턴 종료 🔚");
      for (let key in selectedSkills) selectedSkills[key] = null;
      updateSkillSummary();
      return;
    }

    const action = allActions[i];
    const attacker = action.unit;

    if (attacker.hp <= 0) {
      i++;
      executeNext();
      return;
    }

    if (action.skill.name === '회복') {
      showHealEffect(currentScene, attacker.sprite);
      attacker.hp = Math.min(attacker.hp + action.skill.heal, attacker.maxHp);
      updateHPBar(attacker);
      log(`💚 ${action.name} → 회복 +${action.skill.heal} (HP: ${attacker.hp})`);

      i++;
      setTimeout(() => {
        if (!checkGameEnd()) executeNext();
      }, 600);
      return;
    }

    const targets = action.type === 'ally' ? enemies : allies;
    const targetUnit = Phaser.Utils.Array.GetRandom(targets.filter(t => t.hp > 0));

    if (!targetUnit) {
      log(`${action.name}은 공격할 대상이 없습니다.`);
      i++;
      executeNext();
      return;
    }

    animateAttack(currentScene, action.sprite, targetUnit.sprite, action.sprite.x, () => {
      targetUnit.hp = Math.max(targetUnit.hp - action.skill.damage, 0);
      updateHPBar(targetUnit);

      const prefix = action.type === 'ally' ? '💥' : '😈';
      log(`${prefix} ${action.name} → ${action.skill.name} (${action.skill.damage}) (HP: ${targetUnit.hp})`);

      if (targetUnit.hp <= 0) {
        targetUnit.sprite.setVisible(false);
        targetUnit.hpBar.setVisible(false);
        targetUnit.hpBarBg.setVisible(false);
        log(`💀 ${targetUnit.name} 사망!`);
      }

      i++;
      if (!checkGameEnd()) executeNext();
    });
  }

  log("🎬 턴 시작...");
  executeNext();
};

function animateAttack(scene, attackerSprite, targetSprite, returnX, onComplete) {
  if (!attackerSprite || !targetSprite) {
    onComplete();
    return;
  }

  scene.tweens.add({
    targets: attackerSprite,
    x: 400,
    duration: 500,
    ease: 'Power2',
    onComplete: () => {
      showHitEffect(scene, targetSprite);
      scene.tweens.add({
        targets: attackerSprite,
        x: returnX,
        duration: 500,
        ease: 'Power2',
        onComplete: onComplete
      });
    }
  });
}

function showHitEffect(scene, target) {
  const flash = scene.add.rectangle(target.x, target.y, 40, 40, 0xff0000, 0.5);
  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 300,
    onComplete: () => flash.destroy()
  });
}

function showHealEffect(scene, target) {
  const circle = scene.add.circle(target.x, target.y - 20, 20, 0x00ff00, 0.6);
  scene.tweens.add({
    targets: circle,
    alpha: 0,
    duration: 500,
    onComplete: () => circle.destroy()
  });
}

function updateHPBar(unit) {
  const ratio = unit.hp / unit.maxHp;
  unit.hpBar.width = 60 * ratio;
}

// ✅ 전투 종료 체크
function checkGameEnd() {
  const aliveAllies = allies.filter(a => a.hp > 0);
  const aliveEnemies = enemies.filter(e => e.hp > 0);

  if (aliveAllies.length === 0) {
    showGameOverEffect("💀 게임 오버! 모두 전멸했습니다.");
    return true;
  }

  if (aliveEnemies.length === 0) {
    showGameClearEffect("🎉 게임 클리어! 모든 적을 처치했습니다.");
    return true;
  }

  return false;
}

// ✅ 게임 오버
function showGameOverEffect(message) {
  const text = currentScene.add.text(400, 300, message, {
    fontSize: '32px',
    color: '#ff4444',
    backgroundColor: '#000000',
    padding: 20
  }).setOrigin(0.5);

  currentScene.cameras.main.shake(1000, 0.01);
}

// ✅ 게임 클리어
function showGameClearEffect(message) {
  const text = currentScene.add.text(400, 300, message, {
    fontSize: '32px',
    color: '#44ff44',
    backgroundColor: '#000000',
    padding: 20
  }).setOrigin(0.5);

  for (let i = 0; i < 20; i++) {
    const star = currentScene.add.circle(400, 300, 4, 0xffff00);
    currentScene.tweens.add({
      targets: star,
      x: Phaser.Math.Between(100, 700),
      y: Phaser.Math.Between(100, 500),
      alpha: 0,
      duration: 1000,
      onComplete: () => star.destroy()
    });
  }
}
