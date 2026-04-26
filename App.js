import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const MONSTERS = [
  { id: 1, name: 'التنين الناري', emoji: '🐲', hp: 120, attack: 25 },
  { id: 2, name: 'الذئب المتحول', emoji: '🐺', hp: 90, attack: 30 },
  { id: 3, name: 'العملاق الصخري', emoji: '🗿', hp: 160, attack: 15 },
  { id: 4, name: 'ثعبان البحر', emoji: '🐍', hp: 110, attack: 22 },
];

export default function App() {
  const [gameState, setGameState] = useState('select');
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [log, setLog] = useState('اختر وحشك لبدء المعركة!');

  const startBattle = (m) => {
    setPlayer({ ...m, maxHp: m.hp });
    setEnemy({ ...MONSTERS[Math.floor(Math.random() * MONSTERS.length)], maxHp: 100, hp: 100 });
    setGameState('battle');
  };

  const handleAttack = () => {
    const pDmg = Math.floor(Math.random() * player.attack) + 5;
    const newEnemyHp = Math.max(0, enemy.hp - pDmg);
    setEnemy({ ...enemy, hp: newEnemyHp });
    setLog(`لقد ضربت ${enemy.name} بـ ${pDmg} ضرر!`);

    if (newEnemyHp <= 0) {
      setGameState('win');
      return;
    }

    setTimeout(() => {
      const eDmg = Math.floor(Math.random() * 20) + 5;
      setPlayer(p => {
        const newHp = Math.max(0, p.hp - eDmg);
        if (newHp <= 0) setGameState('lose');
        return { ...p, hp: newHp };
      });
      setLog(`العدو ضربك وسبب لك ${eDmg} ضرر!`);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚔️ حلبة الوحوش ⚔️</Text>
      
      {gameState === 'select' ? (
        <ScrollView contentContainerStyle={styles.monsterList}>
          {MONSTERS.map(m => (
            <TouchableOpacity key={m.id} onPress={() => startBattle(m)} style={styles.card}>
              <Text style={{fontSize: 50}}>{m.emoji}</Text>
              <Text style={styles.monsterName}>{m.name}</Text>
              <Text style={styles.stats}>القوة: {m.attack}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.battleArea}>
          <View style={styles.vsContainer}>
            <View style={styles.unit}>
              <Text style={styles.label}>أنت</Text>
              <Text style={styles.emoji}>{player.emoji}</Text>
              <View style={styles.hpBar}><View style={[styles.hpFill, {width: `${(player.hp/player.maxHp)*100}%`, backgroundColor: '#2ecc71'}]} /></View>
            </View>
            <Text style={styles.vsText}>VS</Text>
            <View style={styles.unit}>
              <Text style={styles.label}>العدو</Text>
              <Text style={styles.emoji}>{enemy.emoji}</Text>
              <View style={styles.hpBar}><View style={[styles.hpFill, {width: `${(enemy.hp/enemy.maxHp)*100}%`, backgroundColor: '#e74c3c'}]} /></View>
            </View>
          </View>
          
          <View style={styles.logBox}><Text style={styles.logText}>{log}</Text></View>

          {gameState === 'battle' ? (
            <TouchableOpacity onPress={handleAttack} style={styles.btnAttack}><Text style={styles.btnText}>هجوووم!</Text></TouchableOpacity>
          ) : (
            <View>
              <Text style={styles.resultText}>{gameState === 'win' ? 'لقد انتصرت! 🎉' : 'لقد هزمت! 💀'}</Text>
              <TouchableOpacity onPress={() => setGameState('select')} style={styles.btnRestart}><Text style={styles.btnText}>لعب مرة أخرى</Text></TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1c2c', paddingTop: 50, alignItems: 'center' },
  title: { fontSize: 24, color: '#f4d03f', fontWeight: 'bold', marginBottom: 20 },
  monsterList: { alignItems: 'center', paddingBottom: 20 },
  card: { backgroundColor: '#2c3e50', padding: 20, borderRadius: 15, marginBottom: 15, width: 200, alignItems: 'center', borderWeight: 2, borderColor: '#5d6d7e' },
  monsterName: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  stats: { color: '#bdc3c7' },
  battleArea: { width: '100%', alignItems: 'center' },
  vsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 30 },
  unit: { alignItems: 'center' },
  label: { color: 'white', marginBottom: 5 },
  emoji: { fontSize: 60 },
  vsText: { color: 'white', fontSize: 30, marginTop: 40 },
  hpBar: { width: 100, height: 10, backgroundColor: '#333', borderRadius: 5, marginTop: 10 },
  hpFill: { height: '100%', borderRadius: 5 },
  logBox: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 15, margin: 20, borderRadius: 10, width: '90%' },
  logText: { color: 'white', textAlign: 'center' },
  btnAttack: { backgroundColor: '#e67e22', padding: 15, borderRadius: 10, width: 200, alignItems: 'center' },
  btnRestart: { backgroundColor: '#3498db', padding: 15, borderRadius: 10, width: 200, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  resultText: { fontSize: 28, color: 'white', marginBottom: 20, textAlign: 'center' }
});
