// =================================================================
// 🎵 BGM（背景の音楽）をコントロールするプログラムだよ 🎵
// 小学生のみんなにもわかるように、やさしいコメントをつけているよ！
// =================================================================

class BGMPlayer {
    constructor() {
        this.ctx = null;            // 音を出すための「AudioContext」という機械（きかい）の入れ物だよ
        this.currentNodes = [];     // 今鳴っている音の部品（オシレーターやゲイン）をためておくリストだよ
        this.currentMode = 'home';  // 今どの音楽を流すかの設定（モード）だよ。最初はホームだよ
        this.isPlaying = false;     // 今音楽が流れているかどうかの目印（めじるし）だよ
        this.isMuted = false;       // ミュート（消音）になっているかどうかの目印だよ
        this.intervalIds = [];      // タイマー（setTimeoutやsetInterval）を止めるためのIDをメモするリストだよ
        
        this.setupInteraction();    // 画面がクリックされたときに音が出るようにする準備だよ
    }

    // 画面をクリックするか、キーを押したときに音の機械（オーディオコンテキスト）を起動するよ
    // （ブラウザの決まりで、人間が操作したあとにしか音を出せないルールがあるんだ）
    setupInteraction() {
        const initAudio = () => {
            if (!this.ctx) {
                // 音を出すための機械をあたらしく作るよ
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx.state === 'suspended') {
                this.ctx.resume(); // 眠っている機械を起こすよ
            }
            if (!this.isPlaying && !this.isMuted) {
                this.play(this.currentMode); // 音楽を再生するよ
            }
            // 一度起動したら、もうこの準備ボタンはいらないから外すよ
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
    }

    // ミュート（音あり／音なし）を切り替えるボタンの機能だよ
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stop(); // ミュートなら音楽を止めるよ
        } else {
            if (this.ctx && this.ctx.state !== 'suspended') {
                this.play(this.currentMode); // 音を出してよければ音楽をスタートするよ
            }
        }
        return this.isMuted; // 今ミュートかどうかをボタンに教えてあげるよ
    }

    // 音楽のモード（画面や裏モード）を切り替えるよ
    setMode(mode) {
        if (this.currentMode === mode) return; // 同じモードなら何もしないよ
        this.currentMode = mode;
        if (this.isPlaying && !this.isMuted) {
            this.play(mode); // 新しいモードの音楽を流すよ
        }
    }

    // 今鳴っている音楽をすべて止めて、きれいにリセットするよ
    stop() {
        this.isPlaying = false;
        // 鳴っている音の部品をひとつずつ止めて接続をはずすよ
        this.currentNodes.forEach(node => {
            try {
                if (node.stop) node.stop();
                if (node.disconnect) node.disconnect();
            } catch (e) {}
        });
        this.currentNodes = [];
        
        // 動いているタイマーも全部ストップするよ
        this.intervalIds.forEach(id => clearTimeout(id));
        this.intervalIds = [];
    }

    // 指定されたモード of 音楽を新しく流すよ
    play(mode) {
        if (!this.ctx) return;
        this.stop(); // まずは前の音をしっかり止めるよ
        this.isPlaying = true;

        // 音の大きさを調節するメインボリューム（マスターゲイン）を作るよ
        const masterGain = this.ctx.createGain();
        masterGain.connect(this.ctx.destination); // スピーカーにつなぐよ

        // モードに合わせて、それぞれの音楽を流す関数を呼び出すよ
        switch (mode) {
            // --- 🏠 アプリの画面ごとのBGM ---
            case 'home': this.playHome(masterGain); break;
            case 'pronunciation': this.playPronunciation(masterGain); break;
            case 'grammar': this.playGrammar(masterGain); break;
            case 'translate': this.playTranslate(masterGain); break;
            case 'quiz': this.playQuiz(masterGain); break;

            // --- ⚙️ 隠しコマンド（裏モード）のBGM ---
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

            // --- 🌟 【追加】新しい隠しコマンドのBGM ---
            case 'space': this.playSpace(masterGain); break;
            case 'matsuri': this.playMatsuri(masterGain); break;
            case 'snow': this.playSnow(masterGain); break;
            case 'gold': this.playGold(masterGain); break;

            default: this.playHome(masterGain); // わからないときはホームにするよ
        }
    }

    // =================================================================
    // 🏠 アプリの画面用 BGM生成ロジック
    // =================================================================

    // 1. ホーム画面：暖かくて優しい和音（Cmaj7 と Fmaj7）のゆったりBGMだよ
    playHome(masterGain) {
        masterGain.gain.value = 0.08; // 全体の音量は優しめにするよ
        const chords = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7 (ド・ミ・ソ・シ)
            [349.23, 440.00, 523.25, 659.25]  // Fmaj7 (ファ・ラ・ド・ミ)
        ];
        let chordIndex = 0;
        
        const playChord = () => {
            if (!this.isPlaying || this.currentMode !== 'home') return;
            const currentChord = chords[chordIndex % chords.length];
            const now = this.ctx.currentTime;
            
            currentChord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle'; // トライアングル波は丸みがあって優しい音になるよ
                osc.frequency.setValueAtTime(freq, now);
                
                // 音量をゆっくり大きくして、ゆっくり消すよ（フェードイン＆アウト）
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.02, now + 1.5);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.8);
                
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 6.0);
                this.currentNodes.push(osc, gain);
            });
            
            chordIndex++;
            const id = setTimeout(playChord, 5000); // 5秒ごとに次のコードを鳴らすよ
            this.intervalIds.push(id);
        };
        playChord();
    }

    // 2. 発音練習画面：発音の邪魔にならない、軽やかで明るいペンタトニックのアルペジオだよ
    playPronunciation(masterGain) {
        masterGain.gain.value = 0.06;
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00]; // ドレミソラ（ペンタトニックスケール）
        let step = 0;
        
        const playStep = () => {
            if (!this.isPlaying || this.currentMode !== 'pronunciation') return;
            const now = this.ctx.currentTime;
            
            const melody = [0, 2, 3, 4, 3, 2, 4, 1]; // メロディの順番
            const freq = scale[melody[step % melody.length]];
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine'; // サイン波はすっきり澄んだ音だよ
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
            
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 1.0);
            this.currentNodes.push(osc, gain);
            
            // 低音でたまにルート音（ドやファ）を優しく鳴らして、広い響きを作るよ
            if (step % 4 === 0) {
                const bassOsc = this.ctx.createOscillator();
                const bassGain = this.ctx.createGain();
                bassOsc.type = 'sine';
                bassOsc.frequency.setValueAtTime(step % 8 === 0 ? 130.81 : 174.61, now); // 低いド または ファ
                
                bassGain.gain.setValueAtTime(0, now);
                bassGain.gain.linearRampToValueAtTime(0.02, now + 0.1);
                bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
                
                bassOsc.connect(bassGain);
                bassGain.connect(masterGain);
                bassOsc.start(now);
                bassOsc.stop(now + 2.0);
                this.currentNodes.push(bassOsc, bassGain);
            }
            
            step++;
            const id = setTimeout(playStep, 450); // テンポよく進めるよ
            this.intervalIds.push(id);
        };
        playStep();
    }

    // 3. 文法画面：勉強に集中できるように、おだやかでチルなコード進行（ジャズ風）のBGMだよ
    playGrammar(masterGain) {
        masterGain.gain.value = 0.06;
        const chords = [
            [293.66, 349.23, 440.00, 523.25], // Dm7 (レ・ファ・ラ・ド)
            [392.00, 493.88, 587.33, 698.46], // G7 (ソ・シ・レ・ファ)
            [261.63, 329.63, 392.00, 493.88], // Cmaj7 (ド・ミ・ソ・シ)
            [220.00, 261.63, 329.63, 392.00]  // Am7 (ラ・ド・ミ・ソ)
        ];
        let chordIndex = 0;
        
        const playChord = () => {
            if (!this.isPlaying || this.currentMode !== 'grammar') return;
            const currentChord = chords[chordIndex % chords.length];
            const now = this.ctx.currentTime;
            
            currentChord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine'; // サイン波で丸みのある優しい響きにするよ
                osc.frequency.setValueAtTime(freq, now);
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.015, now + 2.0);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.8);
                
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 8.0);
                this.currentNodes.push(osc, gain);
            });
            
            chordIndex++;
            const id = setTimeout(playChord, 7000); // 7秒ごとにゆっくりコードを変えるよ
            this.intervalIds.push(id);
        };
        playChord();
    }

    // 4. 翻訳画面：言葉がつながるイメージを、ディレイ（やまびこ）付きのキラキラした和音アルペジオで表現したよ
    playTranslate(masterGain) {
        masterGain.gain.value = 0.05;
        const scale = [261.63, 329.63, 392.00, 523.25, 587.33, 659.25, 783.99, 1046.50]; // ハ長調のきれいなスケール
        let index = 0;
        let up = true;
        
        const playNote = () => {
            if (!this.isPlaying || this.currentMode !== 'translate') return;
            const now = this.ctx.currentTime;
            
            const freq = scale[index];
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            // ディレイ（やまびこ）の部品を作って、音がきれいに響くようにするよ
            const delay = this.ctx.createDelay();
            delay.delayTime.value = 0.35;
            const feedback = this.ctx.createGain();
            feedback.gain.value = 0.3; // ディレイのくり返し音量
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            // ディレイの部品とつなぎ合わせるよ
            gain.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(masterGain);
            
            osc.start(now);
            osc.stop(now + 1.5);
            this.currentNodes.push(osc, gain, delay, feedback);
            
            // 音階を上がったり下がったり往復させるよ
            if (up) {
                index++;
                if (index >= scale.length - 1) up = false;
            } else {
                index--;
                if (index <= 0) up = true;
            }
            
            const id = setTimeout(playNote, 320); // 少しずつずらして鳴らすよ
            this.intervalIds.push(id);
        };
        playNote();
    }

    // 5. テスト（クイズ）画面：はずむリズムと明るいコード進行で、ワクワク感をだすよ
    playQuiz(masterGain) {
        masterGain.gain.value = 0.05;
        const chords = [
            [261.63, 329.63, 392.00], // C (ド・ミ・ソ)
            [349.23, 440.00, 523.25], // F (ファ・ラ・ド)
            [392.00, 493.88, 587.33], // G (ソ・シ・レ)
            [261.63, 329.63, 392.00]  // C (ド・ミ・ソ)
        ];
        let step = 0;
        
        const playStep = () => {
            if (!this.isPlaying || this.currentMode !== 'quiz') return;
            const now = this.ctx.currentTime;
            const currentChord = chords[Math.floor(step / 4) % chords.length];
            
            // リズムに合わせて和音の音をポコポコと跳ねさせて鳴らすよ
            const noteIndex = step % 4;
            let freq;
            if (noteIndex === 0) freq = currentChord[0];      // 低い音
            else if (noteIndex === 1) freq = currentChord[2]; // 高い音
            else if (noteIndex === 2) freq = currentChord[1]; // 真ん中の音
            else freq = currentChord[2] * 1.25;              // さらに高い音（キラッとするアクセント）
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            // ポップではずむように、短い音（アタックとディケイがすばやい音）にするよ
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
            
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 0.3);
            this.currentNodes.push(osc, gain);
            
            step++;
            const id = setTimeout(playStep, 260); // 元気なテンポだよ
            this.intervalIds.push(id);
        };
        playStep();
    }

    // =================================================================
    // ⚙️ 隠しコマンド（裏モード）用 BGM生成ロジック（パワーアップ版）
    // =================================================================

    // normal (通常モード)：Cmaj7のキラキラした音がふわふわと漂う、穏やかな環境音楽（アンビエント）だよ
    playNormal(masterGain) {
        masterGain.gain.value = 0.05;
        const scale = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25];
        
        const playAmbient = () => {
            if (!this.isPlaying || this.currentMode !== 'normal') return;
            const now = this.ctx.currentTime;
            const freq = scale[Math.floor(Math.random() * scale.length)];
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.025, now + 1.0);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);
            
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            osc.stop(now + 4.5);
            this.currentNodes.push(osc, gain);
            
            const nextDelay = 1000 + Math.random() * 2000;
            const id = setTimeout(playAmbient, nextDelay);
            this.intervalIds.push(id);
        };
        playAmbient();
    }

    // ホラーモード：低い不気味なドローン音と、恐怖をそそる半音ズレた不協和音がゆっくり唸るよ
    playHorror(masterGain) {
        masterGain.gain.value = 0.08;
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'sawtooth';
        drone.frequency.value = 55; // 超低音
        
        // フィルターを通して、高音をカットし、暗く重い音にするよ
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 140;
        
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.type = 'sine';
        lfo.frequency.value = 0.15; // ゆったり波打つ
        lfoGain.gain.value = 3;
        
        lfo.connect(lfoGain);
        lfoGain.connect(drone.frequency);
        
        drone.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(masterGain);
        drone.start();
        lfo.start();
        this.currentNodes.push(drone, droneGain, lfo, lfoGain, filter);

        const playSpookySound = () => {
            if (!this.isPlaying || this.currentMode !== 'horror') return;
            const now = this.ctx.currentTime;
            
            // 不安になる不協和音（うなり音）を合成するよ
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc1.type = 'sine';
            osc2.type = 'sine';
            const base = 250 + Math.random() * 300;
            osc1.frequency.value = base;
            osc2.frequency.value = base + 7; // 少しだけずらして唸りを作るよ
            
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 1.2);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(masterGain);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 4.0);
            osc2.stop(now + 4.0);
            this.currentNodes.push(osc1, osc2, gain);
            
            const nextDelay = 3500 + Math.random() * 3500;
            const id = setTimeout(playSpookySound, nextDelay);
            this.intervalIds.push(id);
        };
        playSpookySound();
    }

    // 初代（レトロ）モード：ファミコン風の3音（メロディ、和音伴奏、ベース）で奏でる豪華チップチューンだよ
    playRetro(masterGain) {
        masterGain.gain.value = 0.05;
        const scale = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
        const chords = [
            [261.63, 329.63, 392.00], // C
            [349.23, 440.00, 523.25], // F
            [392.00, 493.88, 587.33], // G
            [220.00, 261.63, 329.63]  // Am
        ];
        
        let step = 0;
        const melody = [0, 2, 4, 3, 2, 4, 5, 4];
        
        const playStep = () => {
            if (!this.isPlaying || this.currentMode !== 'retro') return;
            const now = this.ctx.currentTime;
            
            // 1. メロディ（ピコピコ矩形波）
            const oscMelody = this.ctx.createOscillator();
            const gainMelody = this.ctx.createGain();
            oscMelody.type = 'square';
            const freq = scale[melody[step % melody.length]];
            oscMelody.frequency.setValueAtTime(freq, now);
            gainMelody.gain.setValueAtTime(0.015, now);
            gainMelody.gain.setValueAtTime(0, now + 0.12);
            oscMelody.connect(gainMelody);
            gainMelody.connect(masterGain);
            oscMelody.start(now);
            oscMelody.stop(now + 0.15);
            
            // 2. 伴奏の和音（まろやかな三角波）
            if (step % 2 === 0) {
                const currentChord = chords[Math.floor(step / 4) % chords.length];
                currentChord.forEach(cfreq => {
                    const oscChord = this.ctx.createOscillator();
                    const gainChord = this.ctx.createGain();
                    oscChord.type = 'triangle';
                    oscChord.frequency.setValueAtTime(cfreq, now);
                    gainChord.gain.setValueAtTime(0.012, now);
                    gainChord.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
                    oscChord.connect(gainChord);
                    gainChord.connect(masterGain);
                    oscChord.start(now);
                    oscChord.stop(now + 0.3);
                    this.currentNodes.push(oscChord, gainChord);
                });
            }
            
            // 3. ベース（低音の三角波）
            if (step % 2 === 0) {
                const oscBass = this.ctx.createOscillator();
                const gainBass = this.ctx.createGain();
                oscBass.type = 'triangle';
                const currentChord = chords[Math.floor(step / 4) % chords.length];
                oscBass.frequency.setValueAtTime(currentChord[0] / 2, now); // 1オクターブ低いルート音
                gainBass.gain.setValueAtTime(0.025, now);
                gainBass.gain.setValueAtTime(0, now + 0.2);
                oscBass.connect(gainBass);
                gainBass.connect(masterGain);
                oscBass.start(now);
                oscBass.stop(now + 0.25);
                this.currentNodes.push(oscBass, gainBass);
            }
            
            this.currentNodes.push(oscMelody, gainMelody);
            step++;
            const id = setTimeout(playStep, 150); // タタタタと小気味よいテンポ
            this.intervalIds.push(id);
        };
        playStep();
    }

    // 森（ネイチャー）モード：さらさら流れる風のような環境音と、木のぬくもりがある優しい木琴の調べだよ
    playNature(masterGain) {
        masterGain.gain.value = 0.08;
        // ホワイトノイズから優しい風の音を作るよ
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 350;
        
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.value = 0.3;

        const modulateWind = () => {
            if (!this.isPlaying || this.currentMode !== 'nature') return;
            const time = this.ctx.currentTime;
            filter.frequency.linearRampToValueAtTime(150 + Math.random() * 300, time + 3);
            noiseGain.gain.linearRampToValueAtTime(0.1 + Math.random() * 0.2, time + 3);
            const id = setTimeout(modulateWind, 3000);
            this.intervalIds.push(id);
        };
        modulateWind();

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.start();
        this.currentNodes.push(noise, filter, noiseGain);

        // 木琴（もくきん）風のやわらかいコード音
        const woodScale = [261.63, 329.63, 392.00, 440.00, 523.25]; // ド・ミ・ソ・ラ・ド
        const playWoodNotes = () => {
            if (!this.isPlaying || this.currentMode !== 'nature') return;
            const now = this.ctx.currentTime;
            
            // 2つの音がきれいに重なり合うよ
            const note1 = woodScale[Math.floor(Math.random() * woodScale.length)];
            const note2 = woodScale[Math.floor(Math.random() * woodScale.length)];
            
            [note1, note2].forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.02, now + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
                
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 2.0);
                this.currentNodes.push(osc, gain);
            });
            
            const nextTime = 4000 + Math.random() * 4000;
            const id = setTimeout(playWoodNotes, nextTime);
            this.intervalIds.push(id);
        };
        playWoodNotes();
    }

    // 魔法（マジック）モード：幻想的でふしぎな響き（全音音階）がきらきらと響く、神秘的な音楽だよ
    playMagic(masterGain) {
        masterGain.gain.value = 0.06;
        const scale = [523.25, 587.33, 659.25, 739.99, 830.61, 932.33, 1046.50]; // 不思議な世界を感じるスケール
        const delay = this.ctx.createDelay();
        delay.delayTime.value = 0.4;
        const feedback = this.ctx.createGain();
        feedback.gain.value = 0.55;
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(masterGain);
        this.currentNodes.push(delay, feedback);

        const playSparkle = () => {
            if (!this.isPlaying || this.currentMode !== 'magic') return;
            const now = this.ctx.currentTime;
            
            // 3つの音が時間差でキラキラと折り重なるよ
            for (let i = 0; i < 3; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                
                const freq = scale[Math.floor(Math.random() * scale.length)];
                osc.frequency.setValueAtTime(freq, now + (i * 0.15));
                
                gain.gain.setValueAtTime(0, now + (i * 0.15));
                gain.gain.linearRampToValueAtTime(0.02, now + (i * 0.15) + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + (i * 0.15) + 0.8);
                
                osc.connect(gain);
                gain.connect(masterGain);
                gain.connect(delay);
                
                osc.start(now + (i * 0.15));
                osc.stop(now + (i * 0.15) + 1.0);
                this.currentNodes.push(osc, gain);
            }
            
            const nextTime = 2000 + Math.random() * 2000;
            const id = setTimeout(playSparkle, nextTime);
            this.intervalIds.push(id);
        };
        playSparkle();
    }

    // 海モード：おだやかな深海のうねり（E♭maj7）と、ぷくぷくと浮かび上がる水泡の音だよ
    playSea(masterGain) {
        masterGain.gain.value = 0.08;
        const freqs = [155.56, 196.00, 233.08, 293.66]; // E♭maj7 (ミ♭・ソ・シ♭・レ)
        
        const now = this.ctx.currentTime;
        freqs.forEach(freq => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            // 音量をゆったり波のように揺らすLFO（低周波発振器）だよ
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = 0.08 + Math.random() * 0.08;
            lfoGain.gain.value = 0.015;
            
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            
            gain.gain.setValueAtTime(0.015, now);
            
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            lfo.start(now);
            this.currentNodes.push(osc, gain, lfo, lfoGain);
        });
        
        const playBubble = () => {
            if (!this.isPlaying || this.currentMode !== 'sea') return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const time = this.ctx.currentTime;
            
            // 音がシュッと上がる、かわいい泡の音だよ
            const startFreq = 200 + Math.random() * 100;
            osc.frequency.setValueAtTime(startFreq, time);
            osc.frequency.exponentialRampToValueAtTime(startFreq * 2.8, time + 0.12);
            
            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.025, time + 0.04);
            gain.gain.linearRampToValueAtTime(0, time + 0.12);
            
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(time);
            osc.stop(time + 0.15);
            this.currentNodes.push(osc, gain);
            
            const nextTime = 1200 + Math.random() * 2500;
            const id = setTimeout(playBubble, nextTime);
            this.intervalIds.push(id);
        };
        playBubble();
    }

    // 大空モード：空をふわふわと飛んでいるような、透明感のあるFmaj9コードの重なりだよ
    playSky(masterGain) {
        masterGain.gain.value = 0.05;
        const freqs = [349.23, 440.00, 523.25, 659.25, 783.99]; // Fmaj9 (ファ・ラ・ド・ミ・ソ)
        const now = this.ctx.currentTime;
        
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);
            
            // それぞれの音の揺らぎ（LFO）の速さを変えて、風のような空気感をだすよ
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.type = 'sine';
            lfo.frequency.value = 0.07 + (idx * 0.03);
            lfoGain.gain.value = 0.012;
            
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            
            gain.gain.setValueAtTime(0.015, now);
            
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(now);
            lfo.start(now);
            this.currentNodes.push(osc, gain, lfo, lfoGain);
        });
    }

    // 100均（安物）モード：おもちゃのキーボードから流れるような、すこし気の抜けた可愛いチープ和音メロディだよ
    playCheap(masterGain) {
        masterGain.gain.value = 0.02;
        const chords = [
            [261.63, 329.63, 392.00], // C
            [349.23, 440.00, 523.25]  // F
        ];
        let step = 0;
        
        const playBeep = () => {
            if (!this.isPlaying || this.currentMode !== 'cheap') return;
            const now = this.ctx.currentTime;
            
            const currentChord = chords[Math.floor(step / 2) % chords.length];
            // ピコピコした四角い音（スクエア波）で、２つの音を同時にならすよ
            currentChord.slice(0, 2).forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'square';
                osc.frequency.setValueAtTime(freq, now);
                
                gain.gain.setValueAtTime(0.03, now);
                gain.gain.setValueAtTime(0, now + 0.1);
                
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 0.12);
                this.currentNodes.push(osc, gain);
            });
            
            step++;
            const id = setTimeout(playBeep, 600);
            this.intervalIds.push(id);
        };
        playBeep();
    }

    // 龍玉（ドラゴン）モード：強敵とたたかう勇気がわいてくる、力強いマイナーコード進行のリフだよ
    playDragon(masterGain) {
        masterGain.gain.value = 0.08;
        const chords = [
            [220.00, 261.63, 329.63], // Am (ラ・ド・ミ)
            [293.66, 349.23, 440.00], // Dm (レ・ファ・ラ)
            [246.94, 293.66, 392.00], // G (シ・レ・ソ)
            [220.00, 261.63, 329.63]  // Am (ラ・ド・ミ)
        ];
        let step = 0;
        
        const playBattle = () => {
            if (!this.isPlaying || this.currentMode !== 'dragon') return;
            const now = this.ctx.currentTime;
            const currentChord = chords[Math.floor(step / 4) % chords.length];
            
            // ギザギザした音（ノコギリ波）で激しさをだし、フィルターで少し聴きやすく調整するよ
            currentChord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now);
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(750, now);
                
                gain.gain.setValueAtTime(0.012, now);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
                
                osc.connect(filter);
                filter.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 0.18);
                this.currentNodes.push(osc, gain, filter);
            });
            
            step++;
            const id = setTimeout(playBattle, 180);
            this.intervalIds.push(id);
        };
        playBattle();
    }

    // 天使と悪魔モード：天使のきれいで高い和音と、悪魔の重低音の和音がかわるがわる戦う音楽だよ
    playAngelDemon(masterGain) {
        masterGain.gain.value = 0.05;
        let isAngel = true;
        
        const playTheme = () => {
            if (!this.isPlaying || this.currentMode !== 'angel-demon') return;
            const now = this.ctx.currentTime;
            
            if (isAngel) {
                // 👼 天使のターン：美しく高いピュアなメジャーコード（Cmaj7）
                const freqs = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
                freqs.forEach(freq => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.02, now + 0.5);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
                    
                    osc.connect(gain);
                    gain.connect(masterGain);
                    osc.start(now);
                    osc.stop(now + 2.8);
                    this.currentNodes.push(osc, gain);
                });
            } else {
                // 😈 悪魔のターン：低くて不気味な響きのコード（ディミニッシュコード）
                const freqs = [110.00, 130.81, 155.56, 185.00]; // A2, C3, E♭3, G♭3
                freqs.forEach(freq => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(freq, now);
                    
                    const filter = this.ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, now);
                    
                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.025, now + 0.5);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
                    
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(masterGain);
                    osc.start(now);
                    osc.stop(now + 2.8);
                    this.currentNodes.push(osc, gain, filter);
                });
            }
            
            isAngel = !isAngel;
            const id = setTimeout(playTheme, 3000); // 3秒で交代するよ
            this.intervalIds.push(id);
        };
        playTheme();
    }

    // サイバーモード：電脳（でんのう）世界をイメージした、テクノ風のすばやい和音ベースラインだよ
    playCyber(masterGain) {
        masterGain.gain.value = 0.05;
        const scale = [130.81, 164.81, 196.00, 261.63, 329.63, 392.00, 523.25];
        let step = 0;
        
        const playBit = () => {
            if (!this.isPlaying || this.currentMode !== 'cyber') return;
            const now = this.ctx.currentTime;
            
            const freq = scale[step % scale.length];
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc1.type = 'sawtooth';
            osc2.type = 'square';
            
            osc1.frequency.setValueAtTime(freq, now);
            osc2.frequency.setValueAtTime(freq * 1.005, now); // 少し音をズラして、音に厚みをだすよ
            
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            // 音が「ビョン」と聞こえるかっこいい仕掛け（フィルターを閉じるよ）
            filter.frequency.setValueAtTime(2000, now);
            filter.frequency.exponentialRampToValueAtTime(400, now + 0.1);
            
            gain.gain.setValueAtTime(0.02, now);
            gain.gain.setValueAtTime(0, now + 0.09);
            
            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gain);
            gain.connect(masterGain);
            
            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + 0.1);
            osc2.stop(now + 0.1);
            this.currentNodes.push(osc1, osc2, gain, filter);
            
            step = (step + (Math.random() > 0.7 ? 2 : 1)) % 16;
            const id = setTimeout(playBit, 110);
            this.intervalIds.push(id);
        };
        playBit();
    }

    // 超神様モード：パイプオルガンのように荘厳（そうごん）で、美しいカノン進行の大和音だよ
    playSuperGod(masterGain) {
        masterGain.gain.value = 0.08;
        const chordProgression = [
            [261.63, 329.63, 392.00, 523.25], // C (ド・ミ・ソ・ド)
            [196.00, 246.94, 293.66, 392.00], // G (ソ・シ・レ・ソ)
            [220.00, 261.63, 329.63, 440.00], // Am (ラ・ド・ミ・ラ)
            [164.81, 196.00, 246.94, 329.63], // Em (ミ・ソ・シ・ミ)
            [174.61, 220.00, 261.63, 349.23], // F (ファ・ラ・ド・ファ)
            [261.63, 329.63, 392.00, 523.25]  // C (ド・ミ・ソ・ド)
        ];
        let chordIdx = 0;
        
        const playChords = () => {
            if (!this.isPlaying || this.currentMode !== 'super-god') return;
            const now = this.ctx.currentTime;
            const currentChord = chordProgression[chordIdx % chordProgression.length];
            
            currentChord.forEach(freq => {
                const oscBase = this.ctx.createOscillator();
                const oscHarmonic = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                oscBase.type = 'triangle';
                oscBase.frequency.setValueAtTime(freq, now);
                
                oscHarmonic.type = 'sine';
                oscHarmonic.frequency.setValueAtTime(freq * 2, now); // オクターブ上の綺麗な倍音をかさねるよ
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.015, now + 1.0);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
                
                oscBase.connect(gain);
                oscHarmonic.connect(gain);
                gain.connect(masterGain);
                
                oscBase.start(now);
                oscHarmonic.start(now);
                oscBase.stop(now + 4.0);
                oscHarmonic.stop(now + 4.0);
                this.currentNodes.push(oscBase, oscHarmonic, gain);
            });
            
            chordIdx++;
            const id = setTimeout(playChords, 3500); // 3.5秒で和音を移り変わらせるよ
            this.intervalIds.push(id);
        };
        playChords();
    }

    // 真・ホラーモード：心臓がドキドキするような、激しい悲鳴の不協和音リフレインだよ
    playTrueHorror(masterGain) {
        masterGain.gain.value = 0.15;
        const playScream = () => {
            if (!this.isPlaying || this.currentMode !== 'true-horror') return;
            const now = this.ctx.currentTime;
            
            // 半音ズレのすっごく不安になる周波数を合わせるよ
            const freqs = [600, 607, 614, 621];
            
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
            
            freqs.forEach(freq => {
                const osc = this.ctx.createOscillator();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(freq, now);
                // ピッチが叫び声のように急激に下がる演出だよ
                osc.frequency.exponentialRampToValueAtTime(freq / 2.8, now + 0.65);
                
                osc.connect(gain);
                this.currentNodes.push(osc);
                osc.start(now);
                osc.stop(now + 0.8);
            });
            
            gain.connect(masterGain);
            this.currentNodes.push(gain);
            
            const nextDelay = 1200 + Math.random() * 2000;
            const id = setTimeout(playScream, nextDelay);
            this.intervalIds.push(id);
        };
        playScream();
    }

    // =================================================================
    // 🌟 【追加】新規隠しコマンド（裏モード）用 BGM生成ロジック
    // =================================================================

    // 宇宙旅行（スペース）：シュワシュワとうねるSF風の未来的なコードパッド音だよ
    playSpace(masterGain) {
        masterGain.gain.value = 0.06;
        const freqs = [196.00, 293.66, 392.00, 493.88, 587.33]; // Gmaj9 (ソ・レ・ソ・シ・レ)
        const now = this.ctx.currentTime;
        
        freqs.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            
            // ピッチのゆらぎを作るLFOをつなげるよ
            const pitchLfo = this.ctx.createOscillator();
            const pitchLfoGain = this.ctx.createGain();
            pitchLfo.type = 'sine';
            pitchLfo.frequency.value = 0.2 + (idx * 0.1);
            pitchLfoGain.gain.value = 4.5;
            
            pitchLfo.connect(pitchLfoGain);
            pitchLfoGain.connect(osc.frequency);
            
            // 音量もうねうねと揺らすよ
            const volLfo = this.ctx.createOscillator();
            const volLfoGain = this.ctx.createGain();
            volLfo.type = 'sine';
            volLfo.frequency.value = 0.1 + (idx * 0.05);
            volLfoGain.gain.value = 0.012;
            
            volLfo.connect(volLfoGain);
            volLfoGain.connect(gain.gain);
            
            gain.gain.setValueAtTime(0.015, now);
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.start(now);
            pitchLfo.start(now);
            volLfo.start(now);
            this.currentNodes.push(osc, gain, pitchLfo, pitchLfoGain, volLfo, volLfoGain);
        });
    }

    // お祭り：ピーヒャラと篠笛が鳴り響き、太鼓のドンドコ太いリズムがはずむ、お囃子（おはやし）風の楽しいBGMだよ
    playMatsuri(masterGain) {
        masterGain.gain.value = 0.06;
        const melody = [587.33, 659.25, 783.99, 880.00, 783.99, 659.25, 880.00, 987.77]; // お祭りのお囃子スケール
        let step = 0;
        
        const playBeat = () => {
            if (!this.isPlaying || this.currentMode !== 'matsuri') return;
            const now = this.ctx.currentTime;
            
            // 1. 篠笛（しのぶえ）のピリリとした高音
            if (step % 2 === 0) {
                const oscFlute = this.ctx.createOscillator();
                const gainFlute = this.ctx.createGain();
                oscFlute.type = 'sine';
                oscFlute.frequency.setValueAtTime(melody[Math.floor(step / 2) % melody.length], now);
                
                gainFlute.gain.setValueAtTime(0, now);
                gainFlute.gain.linearRampToValueAtTime(0.02, now + 0.05);
                gainFlute.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
                
                oscFlute.connect(gainFlute);
                gainFlute.connect(masterGain);
                oscFlute.start(now);
                oscFlute.stop(now + 0.4);
                this.currentNodes.push(oscFlute, gainFlute);
            }
            
            // 2. 和太鼓（ドン・ドン・ドコ・ドン）の低音
            const oscDrum = this.ctx.createOscillator();
            const gainDrum = this.ctx.createGain();
            oscDrum.type = 'sine';
            
            const pattern = [1, 0, 1, 1, 1, 0, 1, 0]; // ドンドコ拍子
            if (pattern[step % pattern.length]) {
                const isKoDrum = (step % 4 === 2); // コッという高めの締め太鼓
                oscDrum.frequency.setValueAtTime(isKoDrum ? 150 : 80, now);
                oscDrum.frequency.exponentialRampToValueAtTime(isKoDrum ? 50 : 40, now + 0.1);
                
                gainDrum.gain.setValueAtTime(isKoDrum ? 0.04 : 0.07, now);
                gainDrum.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
                
                oscDrum.connect(gainDrum);
                gainDrum.connect(masterGain);
                oscDrum.start(now);
                oscDrum.stop(now + 0.2);
                this.currentNodes.push(oscDrum, gainDrum);
            }
            
            step++;
            const id = setTimeout(playBeat, 200); // すばやいお祭りテンポ
            this.intervalIds.push(id);
        };
        playBeat();
    }

    // 雪国：しんしんと降る雪のなか、キラキラと輝く氷の結晶（水晶ベル）が静かにきらめくBGMだよ
    playSnow(masterGain) {
        masterGain.gain.value = 0.06;
        const chords = [
            [293.66, 392.00, 493.88, 587.33], // Gmaj7 (ソ・シ・レ・ファ#)
            [261.63, 329.63, 392.00, 523.25]  // Cmaj7 (ド・ミ・ソ・シ)
        ];
        let chordIdx = 0;
        
        const playChord = () => {
            if (!this.isPlaying || this.currentMode !== 'snow') return;
            const now = this.ctx.currentTime;
            const currentChord = chords[chordIdx % chords.length];
            
            // 降る雪を表す、優しく静かな和音コード
            currentChord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now);
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.015, now + 2.5);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 7.8);
                
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 8.0);
                this.currentNodes.push(osc, gain);
            });
            
            // キラリと光る氷の結晶音（高い綺麗なベル音）
            const crystalFreqs = [987.77, 1174.66, 1318.51, 1567.98];
            for (let i = 0; i < 2; i++) {
                const crystalOsc = this.ctx.createOscillator();
                const crystalGain = this.ctx.createGain();
                crystalOsc.type = 'sine';
                crystalOsc.frequency.setValueAtTime(crystalFreqs[Math.floor(Math.random() * crystalFreqs.length)], now + 2.0 + (i * 0.6));
                
                crystalGain.gain.setValueAtTime(0, now + 2.0 + (i * 0.6));
                crystalGain.gain.linearRampToValueAtTime(0.015, now + 2.0 + (i * 0.6) + 0.05);
                crystalGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0 + (i * 0.6) + 1.2);
                
                crystalOsc.connect(crystalGain);
                crystalGain.connect(masterGain);
                crystalOsc.start(now + 2.0 + (i * 0.6));
                crystalOsc.stop(now + 2.0 + (i * 0.6) + 1.5);
                this.currentNodes.push(crystalOsc, crystalGain);
            }
            
            chordIdx++;
            const id = setTimeout(playChord, 7000); // 7秒ごとにゆっくり進行
            this.intervalIds.push(id);
        };
        playChord();
    }

    // 黄金郷（ゴールド）：黄金の鐘（ゴールドベル）がゴージャスに鳴り響く、きらびやかで壮大なメジャーセブンスコードの王宮BGMだよ
    playGold(masterGain) {
        masterGain.gain.value = 0.08;
        const chords = [
            [261.63, 329.63, 392.00, 493.88], // Cmaj7
            [293.66, 369.99, 440.00, 587.33]  // Dmaj7
        ];
        let chordIdx = 0;
        
        const playChord = () => {
            if (!this.isPlaying || this.currentMode !== 'gold') return;
            const now = this.ctx.currentTime;
            const currentChord = chords[chordIdx % chords.length];
            
            // 豪華なゴールドのお城をイメージした、広がりのある優しい和音
            currentChord.forEach(freq => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now);
                
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.02, now + 1.2);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
                
                osc.connect(gain);
                gain.connect(masterGain);
                osc.start(now);
                osc.stop(now + 5.0);
                this.currentNodes.push(osc, gain);
            });
            
            // 金貨がきらきら舞うような、金属的なきらびやかな鐘の音だよ
            const bellFreqs = [1046.50, 1318.51, 1567.98, 2093.00];
            bellFreqs.forEach((freq, idx) => {
                const bellOsc = this.ctx.createOscillator();
                const bellGain = this.ctx.createGain();
                bellOsc.type = 'sine';
                bellOsc.frequency.setValueAtTime(freq, now + 0.5 + (idx * 0.15));
                
                bellGain.gain.setValueAtTime(0, now + 0.5 + (idx * 0.15));
                bellGain.gain.linearRampToValueAtTime(0.025, now + 0.5 + (idx * 0.15) + 0.03);
                bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5 + (idx * 0.15) + 1.8);
                
                bellOsc.connect(bellGain);
                bellGain.connect(masterGain);
                bellOsc.start(now + 0.5 + (idx * 0.15));
                bellOsc.stop(now + 0.5 + (idx * 0.15) + 2.0);
                this.currentNodes.push(bellOsc, bellGain);
            });
            
            chordIdx++;
            const id = setTimeout(playChord, 4500); // 4.5秒ごとに豪華に切り替えるよ
            this.intervalIds.push(id);
        };
        playChord();
    }
}

// BGMPlayerを新しく作って、アプリで使えるようにグローバルに置くよ
const bgmPlayer = new BGMPlayer();

// 画面がすべて準備できたら、切り替えボタンや自動切り替えの設定をONにするよ
document.addEventListener('DOMContentLoaded', () => {
    // 1. 右下の BGM ON/OFF 切り替えボタンの設定だよ
    const bgmToggleBtn = document.getElementById('bgm-toggle-btn');
    if (bgmToggleBtn) {
        bgmToggleBtn.addEventListener('click', () => {
            const isMuted = bgmPlayer.toggleMute();
            bgmToggleBtn.innerText = isMuted ? '🔇 BGM OFF' : '🔊 BGM ON';
            bgmToggleBtn.classList.toggle('muted', isMuted);
        });
    }

    // 2. 今どのBGMを流せばいいか、画面の状態を見て決める関数だよ
    function getActiveMode() {
        const classList = document.body.classList;
        
        // ① まずは秘密の裏モードがONになっているか確認するよ
        if (classList.contains('true-horror-mode')) return 'true-horror';
        if (classList.contains('super-god-mode')) return 'super-god';
        if (classList.contains('cyber-mode')) return 'cyber';
        if (classList.contains('angel-demon-mode')) return 'angel-demon';
        if (classList.contains('dragon-mode')) return 'dragon';
        if (classList.contains('cheap-mode')) return 'cheap';
        if (classList.contains('sky-mode')) return 'sky';
        if (classList.contains('sea-mode')) return 'sea';
        if (classList.contains('horror-mode')) return 'horror';
        if (classList.contains('retro-mode')) return 'retro';
        if (classList.contains('nature-mode')) return 'nature';
        if (classList.contains('magic-mode')) return 'magic';

        // 🌟 新しく追加した裏モードの判定だよ
        if (classList.contains('space-mode')) return 'space';
        if (classList.contains('matsuri-mode')) return 'matsuri';
        if (classList.contains('snow-mode')) return 'snow';
        if (classList.contains('gold-mode')) return 'gold';
        
        // ② 裏モードではないときは、現在選ばれているメニュー（タブ）を確認するよ
        const activeNav = document.querySelector('.nav-item.active');
        if (activeNav) {
            if (activeNav.id === 'nav-home') return 'home';
            if (activeNav.id === 'nav-pronunciation') return 'pronunciation';
            if (activeNav.id === 'nav-grammar') return 'grammar';
            if (activeNav.id === 'nav-translate') return 'translate';
            if (activeNav.id === 'nav-quiz') return 'quiz';
        }
        
        return 'home'; // なにも見つからないときは基本のホーム音楽にするよ
    }

    // 3. 音楽を新しい状態に切り替える命令だよ
    const updateBGM = () => {
        bgmPlayer.setMode(getActiveMode());
    };

    // 体（body）のクラスが変わった（裏モード発動）ときを監視するよ
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                updateBGM();
            }
        });
    });
    observer.observe(document.body, { attributes: true });

    // ナビゲーションのタブ（メニュー）がクリックされたときも監視するよ
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // タブの切り替え処理がすこし進んでからBGMを決めるため、50ミリ秒だけ待って実行するよ
            setTimeout(updateBGM, 50);
        });
    });

    // 最初に読み込んだときの初期モードをセットしておくよ
    bgmPlayer.currentMode = getActiveMode();
});
