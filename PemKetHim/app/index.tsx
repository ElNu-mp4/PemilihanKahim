import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

// Interface untuk data kandidat
interface Candidate {
  id: number;
  name: string;
  vision: string;
  image: any;
  votes: number;
}

export default function Index() {
  // State management
  const [voterName, setVoterName] = useState('');
  const [voterNIM, setVoterNIM] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Data kandidat
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'Ahmad Bahlul',
      vision: 'Membangun himpunan yang solid dan inovatif',
      image: require('../assets/images/kandidat1.jpeg'), // Ganti dengan path image Anda
      votes: 0,
    },
    {
      id: 2,
      name: 'Gibraltar Rakasamudra',
      vision: 'Memberdayakan mahasiswa melalui kolaborasi',
      image: require('../assets/images/kandidat2.jpeg'), // Ganti dengan path image Anda
      votes: 0,
    },
  ]);

  // Fungsi untuk handle pemilihan kandidat
  const handleSelectCandidate = (candidateId: number) => {
    if (!hasVoted) {
      setSelectedCandidate(candidateId);
    }
  };

  // Fungsi untuk submit vote
  const handleVote = () => {
    // Validasi input
    if (voterName.trim() === '') {
      Alert.alert('Error', 'Nama tidak boleh kosong!');
      return;
    }

    if (voterNIM.trim() === '') {
      Alert.alert('Error', 'NIM tidak boleh kosong!');
      return;
    }

    if (voterNIM.length < 8) {
      Alert.alert('Error', 'NIM minimal 8 karakter!');
      return;
    }

    if (selectedCandidate === null) {
      Alert.alert('Error', 'Pilih kandidat terlebih dahulu!');
      return;
    }

    // Konfirmasi vote
    Alert.alert(
      'Konfirmasi Vote',
      `Apakah Anda yakin memilih ${candidates.find(c => c.id === selectedCandidate)?.name}?`,
      [
        {
          text: 'Batal',
          style: 'cancel',
        },
        {
          text: 'Ya, Saya Yakin',
          onPress: () => {
            // Update votes
            setCandidates(prevCandidates =>
              prevCandidates.map(candidate =>
                candidate.id === selectedCandidate
                  ? { ...candidate, votes: candidate.votes + 1 }
                  : candidate
              )
            );

            setHasVoted(true);

            // Tampilkan success message
            Alert.alert(
              'Berhasil!',
              `Terima kasih ${voterName}, suara Anda telah tercatat!`,
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  // Fungsi untuk reset voting
  const handleReset = () => {
    Alert.alert(
      'Reset Voting',
      'Apakah Anda yakin ingin mereset semua data?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setVoterName('');
            setVoterNIM('');
            setSelectedCandidate(null);
            setHasVoted(false);
            setCandidates(prevCandidates =>
              prevCandidates.map(candidate => ({ ...candidate, votes: 0 }))
            );
          },
        },
      ]
    );
  };

  // Fungsi untuk tampilkan hasil voting
  const handleShowResults = () => {
    const totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    
    if (totalVotes === 0) {
      Alert.alert('Info', 'Belum ada suara yang masuk');
      return;
    }

    const results = candidates
      .map(c => {
        const percentage = totalVotes > 0 ? ((c.votes / totalVotes) * 100).toFixed(1) : '0';
        return `${c.name}: ${c.votes} suara (${percentage}%)`;
      })
      .join('\n');

    Alert.alert('Hasil Voting', `Total Suara: ${totalVotes}\n\n${results}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PEMILIHAN KETUA HIMPUNAN</Text>
          <Text style={styles.headerSubtitle}>Pilih pemimpin terbaik untuk kita!</Text>
        </View>

        {/* Form Input Pemilih */}
        {!hasVoted && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Data Pemilih</Text>
            
            <Text style={styles.label}>Nama Lengkap:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama lengkap"
              value={voterName}
              onChangeText={setVoterName}
              editable={!hasVoted}
            />

            <Text style={styles.label}>NIM:</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan NIM"
              value={voterNIM}
              onChangeText={setVoterNIM}
              keyboardType="numeric"
              maxLength={15}
              editable={!hasVoted}
            />
          </View>
        )}

        {/* Kandidat Section */}
        <View style={styles.candidatesContainer}>
          <Text style={styles.sectionTitle}>Pilih Kandidat:</Text>

          {candidates.map((candidate) => (
            <TouchableOpacity
              key={candidate.id}
              style={[
                styles.candidateCard,
                selectedCandidate === candidate.id && styles.selectedCard,
                hasVoted && styles.disabledCard,
              ]}
              onPress={() => handleSelectCandidate(candidate.id)}
              disabled={hasVoted}
              activeOpacity={0.7}
            >
              <Image source={candidate.image} style={styles.candidateImage} />
              
              <View style={styles.candidateInfo}>
                <Text style={styles.candidateName}>{candidate.name}</Text>
                <Text style={styles.candidateVision}>{candidate.vision}</Text>
                <Text style={styles.voteCount}>Total Vote: {candidate.votes}</Text>
              </View>

              {selectedCandidate === candidate.id && !hasVoted && (
                <View style={styles.selectedBadge}>
                  <Text style={styles.selectedBadgeText}>✓ Dipilih</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!hasVoted ? (
            <Button title="VOTE SEKARANG" onPress={handleVote} color="#4CAF50" />
          ) : (
            <View style={styles.votedInfo}>
              <Text style={styles.votedText}>✓ Anda sudah memberikan suara</Text>
            </View>
          )}

          <View style={styles.buttonSpacing} />
          <Button title="Lihat Hasil" onPress={handleShowResults} color="#2196F3" />
          
          <View style={styles.buttonSpacing} />
          <Button title="Reset" onPress={handleReset} color="#f44336" />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 Himpunan Mahasiswa</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#1976D2',
    padding: 20,
    alignItems: 'center',
    paddingTop: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  candidatesContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  candidateCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    borderColor: '#4CAF50',
    backgroundColor: '#f1f8f4',
  },
  disabledCard: {
    opacity: 0.7,
  },
  candidateImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: '#e0e0e0',
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  candidateVision: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  voteCount: {
    fontSize: 12,
    color: '#2196F3',
    fontWeight: '600',
  },
  selectedBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  selectedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonContainer: {
    padding: 15,
    paddingBottom: 30,
  },
  buttonSpacing: {
    height: 10,
  },
  votedInfo: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  votedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
  },
});