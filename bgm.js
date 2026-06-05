class BGMPlayer {
    constructor() {
        this.ctx = null;
        this.currentNodes = [];
        this.currentMode = 'normal';
        this.isPlaying = false;
        this.isMuted = false;
        this.intervalIds = [];
        
        this.setupInteraction();
    }

    setupInteraction() {
        const initAudio = () => {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            if (!this.isPlaying && !this.isMuted) {
                this.play(this.currentMode);
            }
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stop();
        } else {
            if (this.ctx && this.ctx.state !== 'suspended') {
                this.play(this.currentMode);
            }
        }
        return this.isMuted;
    }

    setMode(mode) {
        if (this.currentMode === mode) return;
        this.currentMode = mode;
        if (this.isPlaying && !this.isMuted) {
            this.play(mode);
        }
    }

    stop() {
        this.isPlaying = false;
        this.currentNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {}
        });
        this.currentNodes = [];
        
        this.intervalIds.forEach(id => clearInterval(id));
        this.intervalIds = [];
    }

    play(mode) {
        if (!this.ctx) return;
        this.stop();
        this.isPlaying = true;

        const masterGain = this.ctx.createGain();
        masterGain.connect(this.ctx.destination);

        switch (mode) {
            case 'normal': this.playNormal(masterGain); break;
            case 'horror': this.playHorror(masterGain); break;
            case 'retro': this.playRetro(masterGain); break;
            case 'nature': this.playNature(masterGain); break;
            case 'magic': this.playMagic(masterGain); break;
            case 'sea': this.playSea(masterGain); break;
            case 'sky': this.playSky(masterGain); break;
            case 'cheap': this.playCheap(masterGain); break;
            case 'dragon': this.playDragon(masterGain); break;
            case 'angel-demon': this.playAngelDemon(masterGain); break;
            case 'cyber': this.playCyber(masterGain); break;
            case 'super-god': this.playSuperGod(masterGain); break;
            case 'true-horror': this.playTrueHorror(masterGain); break;
            default: this.playNormal(masterGain);
        }
    }

    // --- 各モードのBGM生成ロジック ---

    playNormal(masterGain) {
        masterGain.gain.value = 0.05;
        const frequencies = [261.63, 329.63, 392.00, 493.88]; // Cmaj7
        frequencies.forEach((freq) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            const time = this.ctx.currentTime;
            gain.gain.setValueAtTime(0, time);
            
            const modulate = () => {
                if (!this.isPlaying || this.currentMode !== 'normal') return;
                const nextTime = this.ctx.currentTime + 2 + Math.random() * 2;
                gain.gain.linearRampToValueAtTime(0.02 + Math.random() * 0.08, nextTime);
                const id = setTimeout(modulate, 2000);
                this.intervalIds.push(id);
            };
            modulate();

            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            this.currentNodes.push(osc, gain);
        });
    }

    playHorror(masterGain) {
        masterGain.gain.value = 0.15;
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sawtooth';
        drone.frequency.value = 55;
        
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.2;
        lfoGain.gain.value = 5;
        lfo.connect(lfoGain);
        lfoGain.connect(drone.frequency);
        
        drone.connect(droneGain);
        droneGain.connect(masterGain);
        drone.start();
        lfo.start();
        this.currentNodes.push(drone, droneGain, lfo, lfoGain);

        const playSpookySound = () => {
            if (!this.isPlaying || this.currentMode !== 'horror') return;
            if (Math.random() > 0.3) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = 400 + Math.random() * 600;
                gain.gain.setValueAtTime(0, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.1, this.ctx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start();
                osc.stop(this.ctx.currentTime + 1);
                this.currentNodes.push(osc, gain);
            }
            const nextDelay = 1000 + Math.random() * 4000;
            const id = setTimeout(playSpookySound, nextDelay);
            this.intervalIds.push(id);
        };
        playSpookySound();
    }

    playRetro(masterGain) {
        masterGain.gain.value = 0.05;
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
        let noteIndex = 0;
        const melody = [0, 2, 4, 2, 3, 5, 4, 1];
        
        const playNote = () => {
            if (!this.isPlaying || this.currentMode !== 'retro') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            const freq = scale[melody[noteIndex % melody.length]];
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.setValueAtTime(0, this.ctx.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.15);
            this.currentNodes.push(osc, gain);
            noteIndex++;
        };
        const id = setInterval(playNote, 150);
        this.intervalIds.push(id);
    }

    playNature(masterGain) {
        masterGain.gain.value = 0.1;
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.5;

        const modulateWind = () => {
            if (!this.isPlaying || this.currentMode !== 'nature') return;
            const time = this.ctx.currentTime;
            filter.frequency.linearRampToValueAtTime(200 + Math.random() * 400, time + 2);
            noiseGain.gain.linearRampToValueAtTime(0.2 + Math.random() * 0.4, time + 2);
            const id = setTimeout(modulateWind, 2000);
            this.intervalIds.push(id);
        };
        modulateWind();

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start();
        this.currentNodes.push(noise, filter, noiseGain);

        const playBird = () => {
            if (!this.isPlaying || this.currentMode !== 'nature') return;
            if (Math.random() > 0.5) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                const time = this.ctx.currentTime;
                const baseFreq = 2000 + Math.random() * 1000;
                osc.frequency.setValueAtTime(baseFreq, time);
                osc.frequency.linearRampToValueAtTime(baseFreq + 500, time + 0.1);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
                gain.gain.linearRampToValueAtTime(0, time + 0.15);
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(time);
                osc.stop(time + 0.2);
                this.currentNodes.push(osc, gain);
            }
            const id = setTimeout(playBird, 1000 + Math.random() * 3000);
            this.intervalIds.push(id);
        };
        playBird();
    }

    playMagic(masterGain) {
        masterGain.gain.value = 0.05;
        const scale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
        const delay = this.ctx.createDelay();
        delay.delayTime.value = 0.3;
        const feedback = this.ctx.createGain();
        feedback.gain.value = 0.4;
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(masterGain);

        const playSparkle = () => {
            if (!this.isPlaying || this.currentMode !== 'magic') return;
            const numNotes = 3 + Math.floor(Math.random() * 3);
            const startTime = this.ctx.currentTime;
            for (let i = 0; i < numNotes; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                const freq = scale[Math.floor(Math.random() * scale.length)];
                osc.frequency.value = freq;
                const noteTime = startTime + (i * 0.1);
                gain.gain.setValueAtTime(0, noteTime);
                gain.gain.linearRampToValueAtTime(0.1, noteTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.5);
                osc.connect(gain);
                gain.connect(masterGain);
                gain.connect(delay);
                osc.start(noteTime);
                osc.stop(noteTime + 0.5);
                this.currentNodes.push(osc, gain);
            }
            const id = setTimeout(playSparkle, 2000 + Math.random() * 2000);
            this.intervalIds.push(id);
        };
        playSparkle();
    }

    playSea(masterGain) {
        masterGain.gain.value = 0.1;
        const drone = this.ctx.createOscillator();
        drone.type = 'sine';
        drone.frequency.value = 100;
        drone.connect(masterGain);
        drone.start();
        this.currentNodes.push(drone);
        
        const playBubble = () => {
            if (!this.isPlaying || this.currentMode !== 'sea') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const time = this.ctx.currentTime;
            osc.frequency.setValueAtTime(200, time);
            osc.frequency.exponentialRampToValueAtTime(600, time + 0.1);
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
            gain.gain.linearRampToValueAtTime(0, time + 0.1);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.15);
            this.currentNodes.push(osc, gain);
            const id = setTimeout(playBubble, 1000 + Math.random() * 3000);
            this.intervalIds.push(id);
        };
        playBubble();
    }

    playSky(masterGain) {
        masterGain.gain.value = 0.05;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine'; osc2.type = 'sine';
        osc1.frequency.value = 880; osc2.frequency.value = 1318.51;
        osc1.connect(masterGain); osc2.connect(masterGain);
        osc1.start(); osc2.start();
        this.currentNodes.push(osc1, osc2);
    }

    playCheap(masterGain) {
        masterGain.gain.value = 0.02;
        const playBeep = () => {
            if (!this.isPlaying || this.currentMode !== 'cheap') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 440;
            const time = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.setValueAtTime(0, time + 0.05);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.1);
            this.currentNodes.push(osc, gain);
            const id = setTimeout(playBeep, 5000);
            this.intervalIds.push(id);
        };
        playBeep();
    }

    playDragon(masterGain) {
        masterGain.gain.value = 0.08;
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00];
        let i = 0;
        const playBattle = () => {
            if (!this.isPlaying || this.currentMode !== 'dragon') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = scale[i % scale.length] * 2;
            const time = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.linearRampToValueAtTime(0, time + 0.1);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.1);
            this.currentNodes.push(osc, gain);
            i += (Math.random() > 0.5 ? 1 : 2);
            const id = setTimeout(playBattle, 120);
            this.intervalIds.push(id);
        };
        playBattle();
    }

    playAngelDemon(masterGain) {
        masterGain.gain.value = 0.05;
        // Angel choir
        const angel = this.ctx.createOscillator();
        angel.type = 'sine';
        angel.frequency.value = 1046.50; // High C
        angel.connect(masterGain);
        angel.start();
        // Demon growl
        const demon = this.ctx.createOscillator();
        demon.type = 'sawtooth';
        demon.frequency.value = 40; // Low E
        demon.connect(masterGain);
        demon.start();
        this.currentNodes.push(angel, demon);
    }

    playCyber(masterGain) {
        masterGain.gain.value = 0.05;
        const playBit = () => {
            if (!this.isPlaying || this.currentMode !== 'cyber') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = 100 + Math.random() * 1000;
            const time = this.ctx.currentTime;
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.setValueAtTime(0, time + 0.05);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.1);
            this.currentNodes.push(osc, gain);
            const id = setTimeout(playBit, 100);
            this.intervalIds.push(id);
        };
        playBit();
    }

    playSuperGod(masterGain) {
        masterGain.gain.value = 0.1;
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 523.25; // C
        const osc2 = this.ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 659.25; // E
        const osc3 = this.ctx.createOscillator();
        osc3.type = 'sine';
        osc3.frequency.value = 783.99; // G
        osc.connect(masterGain); osc2.connect(masterGain); osc3.connect(masterGain);
        osc.start(); osc2.start(); osc3.start();
        this.currentNodes.push(osc, osc2, osc3);
    }

    playTrueHorror(masterGain) {
        masterGain.gain.value = 0.2;
        const playScream = () => {
            if (!this.isPlaying || this.currentMode !== 'true-horror') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            const time = this.ctx.currentTime;
            osc.frequency.setValueAtTime(800, time);
            osc.frequency.exponentialRampToValueAtTime(100, time + 0.5);
            gain.gain.setValueAtTime(0.2, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.6);
            this.currentNodes.push(osc, gain);
            const id = setTimeout(playScream, 500 + Math.random() * 2000);
            this.intervalIds.push(id);
        };
        playScream();
    }
}

const bgmPlayer = new BGMPlayer();

document.addEventListener('DOMContentLoaded', () => {
    const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    if (bgmToggleBtn) {
        bgmToggleBtn.addEventListener('click', () => {
            const isMuted = bgmPlayer.toggleMute();
            bgmToggleBtn.innerText = isMuted ? '🔇 BGM OFF' : '🔊 BGM ON';
            bgmToggleBtn.classList.toggle('muted', isMuted);
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const classList = document.body.classList;
                let newMode = 'normal';
                
                if (classList.contains('true-horror-mode')) newMode = 'true-horror';
                else if (classList.contains('super-god-mode')) newMode = 'super-god';
                else if (classList.contains('cyber-mode')) newMode = 'cyber';
                else if (classList.contains('angel-demon-mode')) newMode = 'angel-demon';
                else if (classList.contains('dragon-mode')) newMode = 'dragon';
                else if (classList.contains('cheap-mode')) newMode = 'cheap';
                else if (classList.contains('sky-mode')) newMode = 'sky';
                else if (classList.contains('sea-mode')) newMode = 'sea';
                else if (classList.contains('horror-mode')) newMode = 'horror';
                else if (classList.contains('retro-mode')) newMode = 'retro';
                else if (classList.contains('nature-mode')) newMode = 'nature';
                else if (classList.contains('magic-mode')) newMode = 'magic';
                
                bgmPlayer.setMode(newMode);
            }
        });
    });

    observer.observe(document.body, { attributes: true });
});
