// --- 利用回数カウンター ---
let pronunciationCount = 0;
let grammarCount = 0;
const quizClearCounts = { peaceful: 0, easy: 0, normal: 0, hard: 0 };

// --- ボタンや入力欄をプログラムで使えるようにする ---
const listenBtn = document.getElementById('listen-btn');
const speakBtn = document.getElementById('speak-btn');
const practiceText = document.getElementById('practice-text');
const statusText = document.getElementById('status-text');
const recognizedText = document.getElementById('recognized-text');
const feedbackMsg = document.getElementById('feedback-msg');

// --- ① お手本の声を聞く機能 (Speech Synthesis) ---
listenBtn.addEventListener('click', () => {
    // しゃべる内容をセットする
    const utterance = new SpeechSynthesisUtterance(practiceText.value);
    utterance.lang = 'en-US'; // 英語（アメリカ）でしゃべる
    
    // ホラーモードのときは声を怖くする
    if (document.body.classList.contains('horror-mode') || document.body.classList.contains('true-horror-mode')) {
        utterance.pitch = 0.1; // 超低音
        utterance.rate = 0.5;  // ゆっくり
    } else if (document.body.classList.contains('sea-mode')) {
        utterance.pitch = 0.5;
        utterance.rate = 0.7;
    } else if (document.body.classList.contains('sky-mode')) {
        utterance.pitch = 1.8;
        utterance.rate = 1.2;
    }
    
    window.speechSynthesis.speak(utterance); // 実際にしゃべる
});

// --- ② 自分の声を聴き取ってチェックする機能 (Speech Recognition) ---
// ブラウザがマイクを使えるかチェック
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // 英語を聴き取る設定

    speakBtn.addEventListener('click', () => {
        pronunciationCount++;
        if (pronunciationCount === 10) {
            document.body.className = '';
            document.body.classList.add('sea-mode');
            alert("🌊 隠しコマンド【海の翻訳君】が解放されました！\n合言葉は「海」です。");
        }
        try {
            recognition.start(); // 録音スタート！
            statusText.innerText = "🎤 聴いています...";
            recognizedText.innerText = "";
            feedbackMsg.innerText = "";
        } catch (e) {
            // すでに始まっているときはエラーを出さないようにする
            console.log("すでに聞き取り中です");
        }
    });

    // 言葉が聴き取れたとき
    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript; // 聴き取れた言葉
        const lowerSpokenText = spokenText.toLowerCase();
        
        // --- 【隠しコマンド】モード切り替え判定 ---
        if (spokenText.includes("ホラー") || lowerSpokenText.includes("horror")) {
            // ホラー翻訳君
            document.body.classList.remove("retro-mode", "magic-mode", "nature-mode");
            document.body.classList.add("horror-mode");
            recognizedText.innerHTML = "🩸 禁断の翻訳システム起動...<br>戻ることはできない...";
            feedbackMsg.innerText = "暗闇の中から、声が聞こえる...";
            feedbackMsg.className = "incorrect";
            updateDifficultyOptions(); // 難易度リストを更新
            return;
        } else if (spokenText.includes("森の翻訳君") || lowerSpokenText.includes("nature") || lowerSpokenText.includes("mori")) {
            // 森の翻訳君（ネイチャー）
            document.body.classList.remove("retro-mode", "magic-mode");
            document.body.classList.add("nature-mode");
            recognizedText.innerHTML = "🍃 森の翻訳システム起動...<br>癒やしの翻訳空間へようこそ。";
            feedbackMsg.innerText = "自然のささやきを、言葉に。";
            feedbackMsg.className = "correct";
            return;
        } else if (spokenText.includes("魔法の翻訳君") || spokenText.includes("マジック") || lowerSpokenText.includes("magic") || lowerSpokenText.includes("mahou")) {
            // 魔法の翻訳君（未来）
            document.body.classList.remove("retro-mode", "nature-mode");
            document.body.classList.add("magic-mode");
            recognizedText.innerHTML = "🌀 次元間翻訳システム起動...<br>魔法の翻訳君 V3.0 へようこそ！";
            feedbackMsg.innerText = "宇宙の言葉も、瞬時に。";
            feedbackMsg.className = "correct";
            return;
        } else if (spokenText.includes("初代翻訳君") || lowerSpokenText.includes("shodai")) {
            // 初代翻訳君（レトロ）
            document.body.classList.remove("magic-mode", "nature-mode");
            document.body.classList.add("retro-mode");
            recognizedText.innerHTML = "📟 隠しコマンド発動！<br>初代翻訳君仕様になったよ！";
            feedbackMsg.innerText = "カッコいいレトロデザインを楽しんでね！";
            feedbackMsg.className = "correct";
            return;
        } else if (spokenText.includes("海")) {
            document.body.className = ''; document.body.classList.add("sea-mode");
            recognizedText.innerHTML = "🌊 海の翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("大空")) {
            document.body.className = ''; document.body.classList.add("sky-mode");
            recognizedText.innerHTML = "☁️ 空の翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("安物")) {
            document.body.className = ''; document.body.classList.add("cheap-mode");
            recognizedText.innerHTML = "📦 100均翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("エンマ大王")) {
            document.body.className = ''; document.body.classList.add("angel-demon-mode");
            recognizedText.innerHTML = "⚖️ 天使と悪魔の翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("ドラゴンとボール")) {
            document.body.className = ''; document.body.classList.add("dragon-mode");
            recognizedText.innerHTML = "🔥 龍玉翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("ハッカー")) {
            document.body.className = ''; document.body.classList.add("cyber-mode");
            recognizedText.innerHTML = "💻 サイバー翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("どうやってここまで")) {
            document.body.className = ''; document.body.classList.add("super-god-mode");
            recognizedText.innerHTML = "🌟 超神様的翻訳君起動！"; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("恐怖体験")) {
            document.body.className = ''; document.body.classList.add("true-horror-mode");
            recognizedText.innerHTML = "🩸 真・ホラー翻訳君起動..."; feedbackMsg.innerText = ""; return;
        } else if (spokenText.includes("翻訳君") || lowerSpokenText.includes("honyaku")) {
            // 元に戻る
            document.body.classList.remove("retro-mode", "magic-mode", "nature-mode");
            recognizedText.innerHTML = "✨ 元の最新モードに戻ったよ！";
            feedbackMsg.innerText = "";
            return;
        }
        // ------------------------------------------

        // 元の文と、しゃべった文を単語ごとに分ける
        const originalWords = practiceText.value.toLowerCase().replace(/[.,?!]/g, "").split(/\s+/);
        const spokenWords = spokenText.toLowerCase().replace(/[.,?!]/g, "").split(/\s+/);

        // 画面に表示するための「結果HTML」を作る
        let resultHtml = "";
        let isAllCorrect = true;

        // しゃべった単語をひとつずつチェック
        spokenWords.forEach((word, index) => {
            if (word === originalWords[index]) {
                // 合っている単語は緑色
                resultHtml += `<span class="word correct-word">${word}</span> `;
            } else {
                // 間違っている単語は赤色
                resultHtml += `<span class="word incorrect-word">${word}</span> `;
                isAllCorrect = false;
            }
        });

        recognizedText.innerHTML = "聴き取れた内容:<br>" + resultHtml;
        
        // 全部の単語が合っているかチェック
        if (isAllCorrect && spokenWords.length === originalWords.length) {
            feedbackMsg.innerText = "✨ 完ぺき！ 素晴らしい発音だね！";
            feedbackMsg.className = "correct";
        } else if (isAllCorrect && spokenWords.length < originalWords.length) {
            feedbackMsg.innerText = "途中までは合ってるよ！最後まで言ってみよう。";
            feedbackMsg.className = "incorrect";
        } else {
            feedbackMsg.innerText = "赤色のところが少し違うみたい。もう一度！";
            feedbackMsg.className = "incorrect";
        }
    };

    // 録音が終わったとき
    recognition.onend = () => {
        // エラーが出ていなければ、案内を表示する
        if (!statusText.innerText.includes("❌")) {
            statusText.innerText = "ボタンを押して再挑戦！";
        }
    };

    // エラーが起きたとき
    recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
            statusText.innerText = "❌ マイクの許可がないよ。「設定を確認してね」";
        } else if (event.error === 'no-speech') {
            statusText.innerText = "❌ 声が聞こえなかったよ。「もう一度しゃべってみてね」";
        } else if (event.error === 'network') {
            statusText.innerText = "❌ インターネットがないよ。「ネットを確認してね」";
        } else {
            statusText.innerText = "❌ エラーが起きたよ: " + event.error;
        }

        // もしURLが「127.0.0.1」ならヒントを出す
        if (location.hostname === "127.0.0.1") {
            statusText.innerText += "\n（ヒント：アドレスを localhost:3000 に変えてみてね）";
        }
    };

} else {
    // マイクが使えないブラウザのとき
    speakBtn.disabled = true;
    statusText.innerText = "お使いのブラウザではマイクが使えません。";
}

// --- ③ 画面の切り替え機能 (Tab Navigation) ---
// 画面の入れ物（セクション）をあつめる
const sections = {
    'nav-home': document.getElementById('home-section'),
    'nav-pronunciation': document.getElementById('pronunciation-section'),
    'nav-grammar': document.getElementById('grammar-section'),
    'nav-translate': document.getElementById('translate-section'),
    'nav-quiz': document.getElementById('quiz-section')
};

const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        // 1. すべての画面をいったん隠す
        Object.values(sections).forEach(section => {
            if (section) section.style.display = 'none';
        });
        // 2. すべてのボタンの「active（選ばれている色）」を消す
        navItems.forEach(nav => nav.classList.remove('active'));

        // 3. 押されたボタンに対応する画面だけを表示する
        const targetSection = sections[item.id];
        if (targetSection) {
            targetSection.style.display = 'block';
            item.classList.add('active');
        } else {
            // まだ作っていない画面のときはホームを出す
            sections['nav-home'].style.display = 'block';
            document.getElementById('nav-home').classList.add('active');
            alert("この機能はまだ準備中だよ！");
        }
    });
});

// --- ④ 文法まるわかり機能 (Grammar Analysis) ---
// 主語（S）になりやすい言葉（代名詞など）
const subjectsList = [
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'my', 'your', 
    'ken', 'yumi', 'tom', 'mary', 'john', 'amy', 'bob', 'kenji', 'sakura', 'mike', 'lucy',
    'father', 'mother', 'brother', 'sister', 'friend', 'friends', 'teacher', 'students',
    'someone', 'everyone', 'anyone', 'noone', 'everything', 'something'
];
// 動詞（V）になりやすい言葉
const commonVerbsList = [
    'am', 'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has', 'had', 
    'go', 'goes', 'went', 'like', 'likes', 'liked', 'want', 'wants', 'wanted', 
    'skip', 'skips', 'skipped', 'play', 'plays', 'played', 'practice', 'practices', 'practiced',
    'eat', 'eats', 'ate', 'drink', 'drinks', 'drank', 'see', 'sees', 'saw', 'watch', 'watches', 'watched',
    'read', 'reads', 'write', 'writes', 'wrote', 'speak', 'speaks', 'spoke', 'listen', 'listens', 'listened',
    'study', 'studies', 'studied', 'work', 'works', 'worked', 'help', 'helps', 'helped',
    'make', 'makes', 'made', 'know', 'knows', 'knew', 'think', 'thinks', 'thought', 'get', 'gets', 'got',
    'take', 'takes', 'took', 'come', 'comes', 'came', 'run', 'runs', 'ran', 'swim', 'swims', 'swam',
    'can', 'could', 'will', 'would', 'shall', 'should', 'may', 'might', 'must',
    'walk', 'walks', 'walked', 'sleep', 'sleeps', 'slept', 'buy', 'buys', 'bought', 'sell', 'sells', 'sold'
];
// 名詞（Noun）になりやすい言葉（ものの名前）
const commonNounsList = [
    'apple', 'apples', 'basketball', 'practice', 'school', 'book', 'books', 'dog', 'dogs', 'cat', 'cats', 
    'water', 'music', 'soccer', 'tennis', 'piano', 'today', 'yesterday', 'tomorrow', 'time', 'money', 'life',
    'english', 'math', 'science', 'history', 'art', 'teacher', 'student', 'lunch', 'dinner', 'breakfast',
    'bread', 'rice', 'meat', 'fish', 'milk', 'juice', 'coffee', 'tea', 'fruit', 'vegetable',
    'library', 'park', 'station', 'hospital', 'store', 'shop', 'home', 'house', 'room', 'bed',
    'pen', 'pencil', 'notebook', 'bag', 'clock', 'computer', 'phone', 'camera', 'tv', 'movie',
    'game', 'toy', 'car', 'bus', 'train', 'plane', 'bike', 'bicycle', 'sea', 'mountain', 'river',
    'sun', 'moon', 'star', 'weather', 'rain', 'snow', 'wind', 'flower', 'tree', 'bird', 'animal',
    'desk', 'chair', 'eraser', 'classroom', 'earth', 'world', 'city', 'country', 'family', 'people',
    'bag', 'cap', 'hat', 'shoes', 'egg', 'cake', 'cookie', 'pizza', 'hamburger', 'sandwich'
];
// 名詞の前によくつく言葉（冠詞：かんし）
const determinersList = ['a', 'an', 'the'];

// 形容詞（Adjective）になりやすい言葉
const commonAdjsList = [
    'happy', 'sad', 'big', 'small', 'good', 'bad', 'beautiful', 'hot', 'cold', 'new', 'old', 'easy', 'hard',
    'difficult', 'interesting', 'excited', 'exciting', 'busy', 'hungry', 'thirsty', 'famous',
    'rich', 'poor', 'fast', 'slow', 'long', 'short', 'tall', 'low', 'strong', 'weak',
    'kind', 'smart', 'funny', 'cute', 'cool', 'special', 'important', 'wonderful', 'great',
    'red', 'blue', 'green', 'yellow', 'white', 'black', 'colorful', 'sunny', 'cloudy',
    'sweet', 'bitter', 'salty', 'heavy', 'light', 'clean', 'dirty', 'pretty', 'scary'
];
// 副詞（Adverb）になりやすい言葉
const commonAdverbsList = [
    'just', 'always', 'often', 'sometimes', 'usually', 'very', 'really', 'too', 'well', 
    'now', 'then', 'here', 'there', 'soon', 'already', 'yet', 'still', 'maybe', 'perhaps',
    'together', 'alone', 'only', 'even', 'almost', 'never', 'again', 'back', 'forward',
    'quickly', 'slowly', 'early', 'late', 'well', 'hard', 'hardly'
];

const analyzeBtn = document.getElementById('analyze-btn');
const grammarInput = document.getElementById('grammar-input');
const grammarOutput = document.getElementById('grammar-output');
const grammarStatus = document.getElementById('grammar-status');

analyzeBtn.addEventListener('click', () => {
    grammarCount++;
    if (grammarCount === 10) {
        document.body.className = '';
        document.body.classList.add('sky-mode');
        alert("☁️ 隠しコマンド【空の翻訳君】が解放されました！\n合言葉は「大空」です。");
    }
    const text = grammarInput.value;
    if (!text.trim()) {
        grammarStatus.innerText = "英文を入力してね！";
        return;
    }

    // --- 【隠しコマンド】テキスト入力でも発動！ ---
    const lowerText = text.toLowerCase();
    
    // --- 【隠しコマンド】ホラーモード発動！ ---
    if (text.includes("ホラー") || lowerText.includes("horror")) {
        document.body.classList.remove("retro-mode", "magic-mode", "nature-mode");
        document.body.classList.add("horror-mode");
        grammarStatus.innerText = "🩸 ホラー翻訳君 起動... 後ろに誰かいるよ...";
        grammarOutput.innerHTML = "";
        updateDifficultyOptions(); // 難易度リストを更新
        return;
    } else if (text.includes("森の翻訳君") || lowerText.includes("nature") || lowerText.includes("mori")) {
        document.body.classList.remove("retro-mode", "magic-mode");
        document.body.classList.add("nature-mode");
        grammarStatus.innerText = "🍃 森の翻訳君 起動！自然の癒やしを感じてね。";
        grammarOutput.innerHTML = "";
        return;
    } else if (text.includes("魔法の翻訳君") || text.includes("マジック") || lowerText.includes("magic") || lowerText.includes("mahou")) {
        document.body.classList.remove("retro-mode", "nature-mode");
        document.body.classList.add("magic-mode");
        grammarStatus.innerText = "🌀 魔法の翻訳君 V3.0 起動！全言語・次元間翻訳システムへようこそ！";
        grammarOutput.innerHTML = "";
        return;
    } else if (text.includes("初代翻訳君") || lowerText.includes("shodai")) {
        document.body.classList.remove("magic-mode", "nature-mode");
        document.body.classList.add("retro-mode");
        grammarStatus.innerText = "📟 隠しコマンド発動！初代翻訳君仕様になったよ！";
        grammarOutput.innerHTML = "";
        return;
    } else if (text.includes("翻訳君") || lowerText.includes("honyaku")) {
        document.body.classList.remove("retro-mode", "magic-mode", "nature-mode", "horror-mode");
        grammarStatus.innerText = "✨ 元の最新モードに戻ったよ！";
        grammarOutput.innerHTML = "";
        return;
    }
    // ---------------------------------------------

    // 文章をスペースで区切って、単語のリストにする
    const words = text.split(/\s+/);
    let resultHtml = "";

    words.forEach(word => {
        // 判定しやすくするために、小文字にして、点（.）などを消す
        const cleanWord = word.toLowerCase().replace(/[.,?!]/g, "");
        let type = "other"; // 最初は「その他」にしておく

        // --- 1. 短縮形（'がついた言葉）の特別ルール ---
        if (cleanWord.includes("'")) {
            if (cleanWord.startsWith("don") || cleanWord.startsWith("can") || cleanWord.startsWith("isn") || cleanWord.startsWith("doesn") || cleanWord.startsWith("didn") || cleanWord.startsWith("won")) {
                type = "verb"; // don't, can'tなどは動詞
            } else if (cleanWord.startsWith("i'") || cleanWord.startsWith("it'") || cleanWord.startsWith("you'") || cleanWord.startsWith("he'") || cleanWord.startsWith("she'")) {
                type = "subject"; // I'm, It'sなどは主語
            }
        }

        // --- 2. 判定のルール（順番が重要！） ---
        if (type === "other") {
            // ① 名詞の前につく言葉（a, theなど）をチェック
            if (determinersList.includes(cleanWord)) {
                type = "noun"; // これも名詞の仲間として扱うよ
            }
            // ② 主語のリストにあるかチェック
            else if (subjectsList.includes(cleanWord)) {
                type = "subject";
            } 
            // ③ 名詞のリストにあるかチェック
            else if (commonNounsList.includes(cleanWord)) {
                type = "noun";
            }
            // ④ 動詞のルール（リストにあるか、最後にedやingがつくか）
            else if (commonVerbsList.includes(cleanWord) || 
                     cleanWord.endsWith('ed') || 
                     (cleanWord.endsWith('ing') && cleanWord.length > 3) ||
                     (cleanWord.endsWith('s') && cleanWord.length > 3 && !cleanWord.endsWith('ss'))) {
                // ※sで終わる言葉は動詞（3人称単数）の可能性があるけど、名詞の複数形かもしれないね。
                // ここではいったん動詞としてチェックするよ。
                type = "verb";
            }
            // ⑤ 形容詞のルール
            else if (commonAdjsList.includes(cleanWord) || cleanWord.endsWith('ful') || cleanWord.endsWith('able')) {
                type = "adj";
            }
            // ⑥ 副詞のルール
            else if (commonAdverbsList.includes(cleanWord) || (cleanWord.endsWith('ly') && cleanWord.length > 3)) {
                type = "adv";
            }
            
            // --- 特別な「名詞の複数形」の追加ルール ---
            // 動詞と判定されたけど、実は名詞の複数形かもしれない場合（sで終わるなど）
            // （ここでは簡単にするために、さっき動詞にならなかった「s」で終わる言葉を名詞にしてみるよ）
            if (type === "other" && cleanWord.endsWith('s') && cleanWord.length > 3) {
                type = "noun";
            }
        }

        // 色を付けたHTMLを作る
        resultHtml += `<span class="grammar-word ${type}">${word}</span> `;
    });

    // 画面に結果を表示する
    grammarStatus.innerText = "✨ 超・本格的な解析が終わったよ！";
    grammarOutput.innerHTML = resultHtml;
});

// --- ⑤ 翻訳機能 (Translation Function) ---
const translateBtn = document.getElementById('translate-btn');
const translateInput = document.getElementById('translate-input');
const translateOutput = document.getElementById('translate-output');
const translateStatus = document.getElementById('translate-status');
const translateDirection = document.getElementById('translate-direction'); // メニューを取得

// メニューが切り替わったときに、入力欄のヒント（例）を変える
translateDirection.addEventListener('change', () => {
    if (translateDirection.value === 'en|ja') {
        translateInput.placeholder = "例: I like soccer.";
        translateInput.value = "I like soccer.";
    } else {
        translateInput.placeholder = "例: 私はサッカーが好きです。";
        translateInput.value = "私はサッカーが好きです。";
    }
});

translateBtn.addEventListener('click', async () => {
    const text = translateInput.value; // 入力された言葉そのまま
    if (!text.trim()) {
        translateStatus.innerText = "言葉を入力してね！";
        return;
    }

    // --- 【隠しコマンド】テキスト入力でも発動！ ---
    const lowerText = text.toLowerCase();
    
    // --- 【隠しコマンド】ホラーモード発動！ ---
    if (text.includes("ホラー") || lowerText.includes("horror")) {
        document.body.classList.remove("retro-mode", "magic-mode", "nature-mode");
        document.body.classList.add("horror-mode");
        translateStatus.innerText = "🩸 ホラー翻訳君 起動... 逃げられない...";
        translateOutput.innerText = "";
        updateDifficultyOptions(); // 難易度リストを更新
        return;
    } else if (text.includes("森の翻訳君") || lowerText.includes("nature") || lowerText.includes("mori")) {
        document.body.classList.remove("retro-mode", "magic-mode");
        document.body.classList.add("nature-mode");
        translateStatus.innerText = "🍃 森の翻訳君 起動！自然の癒やしを感じてね。";
        translateOutput.innerText = "";
        return;
    } else if (text.includes("魔法の翻訳君") || text.includes("マジック") || lowerText.includes("magic") || lowerText.includes("mahou")) {
        document.body.classList.remove("retro-mode", "nature-mode");
        document.body.classList.add("magic-mode");
        translateStatus.innerText = "🌀 魔法の翻訳君 V3.0 起動！全言語・次元間翻訳システムへようこそ！";
        translateOutput.innerText = "";
        return;
    } else if (text.includes("初代翻訳君") || lowerText.includes("shodai")) {
        document.body.classList.remove("magic-mode", "nature-mode");
        document.body.classList.add("retro-mode");
        translateStatus.innerText = "📟 隠しコマンド発動！初代翻訳君仕様になったよ！";
        translateOutput.innerText = "";
        return;
    } else if (text.includes("海")) {
        document.body.className = ''; document.body.classList.add("sea-mode");
        translateStatus.innerText = "🌊 海の翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("大空")) {
        document.body.className = ''; document.body.classList.add("sky-mode");
        translateStatus.innerText = "☁️ 空の翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("安物")) {
        document.body.className = ''; document.body.classList.add("cheap-mode");
        translateStatus.innerText = "📦 100均翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("エンマ大王")) {
        document.body.className = ''; document.body.classList.add("angel-demon-mode");
        translateStatus.innerText = "⚖️ 天使と悪魔の翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("ドラゴンとボール")) {
        document.body.className = ''; document.body.classList.add("dragon-mode");
        translateStatus.innerText = "🔥 龍玉翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("ハッカー")) {
        document.body.className = ''; document.body.classList.add("cyber-mode");
        translateStatus.innerText = "💻 サイバー翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("どうやってここまで")) {
        document.body.className = ''; document.body.classList.add("super-god-mode");
        translateStatus.innerText = "🌟 超神様的翻訳君起動！"; translateOutput.innerText = ""; return;
    } else if (text.includes("恐怖体験")) {
        document.body.className = ''; document.body.classList.add("true-horror-mode");
        translateStatus.innerText = "🩸 真・ホラー翻訳君起動..."; translateOutput.innerText = ""; return;
    } else if (text.includes("翻訳君") || lowerText.includes("honyaku")) {
        document.body.classList.remove("retro-mode", "magic-mode", "nature-mode", "horror-mode");
        translateStatus.innerText = "✨ 元の最新モードに戻ったよ！";
        translateOutput.innerText = "";
        updateDifficultyOptions(); // 難易度リストを元に戻す
        return;
    }
    // ---------------------------------------------

    // メニューで選ばれている「合言葉（en|ja または ja|en）」を取得する
    const langpair = translateDirection.value;

    // 翻訳ロボットに聞いている間のメッセージ
    translateStatus.innerText = "インターネットの翻訳ロボットに聞いています...🔄";
    translateOutput.innerText = "";

    try {
        // 外部の翻訳サービス（MyMemory）に「お願い！」と手紙を送る（fetchの魔法）
        // langpair の部分が、さっき選んだメニューの値になるよ！
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;
        const response = await fetch(url);
        const data = await response.json();

        // 翻訳ロボットからの返事を受け取る
        const result = data.responseData.translatedText;
        
        // 画面に表示する
        translateStatus.innerText = "✨ 翻訳ロボットが訳してくれたよ！";
        translateOutput.innerText = result;

        const speakBtnTr = document.getElementById('translate-speak-btn');
        if (speakBtnTr) {
            speakBtnTr.style.display = 'inline-block';
            speakBtnTr.onclick = () => {
                const utterance = new SpeechSynthesisUtterance(result);
                utterance.lang = langpair === 'en|ja' ? 'ja-JP' : 'en-US';
                if (document.body.classList.contains('horror-mode') || document.body.classList.contains('true-horror-mode')) {
                    utterance.pitch = 0.1; utterance.rate = 0.5;
                } else if (document.body.classList.contains('sea-mode')) {
                    utterance.pitch = 0.5; utterance.rate = 0.7;
                } else if (document.body.classList.contains('sky-mode')) {
                    utterance.pitch = 1.8; utterance.rate = 1.2;
                }
                window.speechSynthesis.speak(utterance);
            };
        }

    } catch (error) {
        // もしインターネットがつながっていなかったら
        translateStatus.innerText = "❌ ロボットに繋がらなかったよ。「ネットを確認してね」";
        console.error("翻訳エラー:", error);
    }
});

// --- ⑥ 単語テスト機能 (Quiz Function) ---
const quizWords = {
    peaceful: [
        { en: 'apple', ja: 'りんご' },
        { en: 'dog', ja: '犬' },
        { en: 'cat', ja: '猫' },
        { en: 'pen', ja: 'ペン' },
        { en: 'book', ja: '本' },
        { en: 'red', ja: '赤' },
        { en: 'blue', ja: '青' },
        { en: 'sun', ja: '太陽' },
        { en: 'milk', ja: '牛乳' },
        { en: 'egg', ja: '卵' },
        { en: 'box', ja: '箱' },
        { en: 'fish', ja: '魚' },
        { en: 'hat', ja: '帽子' },
        { en: 'cup', ja: 'カップ' },
        { en: 'star', ja: '星' }
    ],
    easy: [
        { en: 'school', ja: '学校' },
        { en: 'soccer', ja: 'サッカー' },
        { en: 'water', ja: '水' },
        { en: 'happy', ja: '幸せ' },
        { en: 'friend', ja: '友達' },
        { en: 'music', ja: '音楽' },
        { en: 'tennis', ja: 'テニス' },
        { en: 'lunch', ja: '昼食' },
        { en: 'bread', ja: 'パン' },
        { en: 'fruit', ja: '果物' },
        { en: 'garden', ja: '庭' },
        { en: 'train', ja: '電車' },
        { en: 'winter', ja: '冬' },
        { en: 'summer', ja: '夏' },
        { en: 'flower', ja: '花' }
    ],
    normal: [
        { en: 'library', ja: '図書館' },
        { en: 'practice', ja: '練習' },
        { en: 'grammar', ja: '文法' },
        { en: 'subject', ja: '主語' },
        { en: 'verb', ja: '動詞' },
        { en: 'noun', ja: '名詞' },
        { en: 'adjective', ja: '形容詞' },
        { en: 'translate', ja: '翻訳' },
        { en: 'correct', ja: '正解' },
        { en: 'incorrect', ja: '不正解' },
        { en: 'dictionary', ja: '辞書' },
        { en: 'sentence', ja: '文章' },
        { en: 'meaning', ja: '意味' },
        { en: 'pronoun', ja: '代名詞' },
        { en: 'preposition', ja: '前置詞' }
    ],
    hard: [
        { en: 'pronunciation', ja: '発音' },
        { en: 'recognition', ja: '認識' },
        { en: 'analysis', ja: '解析' },
        { en: 'determine', ja: '決定する' },
        { en: 'feedback', ja: 'フィードバック' },
        { en: 'instruction', ja: '指示' },
        { en: 'experience', ja: '経験' },
        { en: 'environment', ja: '環境' },
        { en: 'description', ja: '説明' },
        { en: 'opportunity', ja: '機会' },
        { en: 'knowledge', ja: '知識' },
        { en: 'challenge', ja: '挑戦' },
        { en: 'significant', ja: '重要な' },
        { en: 'potential', ja: '可能性' },
        { en: 'efficient', ja: '効率的な' }
    ],
    expert: [
        { en: 'philosophy', ja: '哲学' },
        { en: 'strategy', ja: '戦略' },
        { en: 'consciousness', ja: '意識' },
        { en: 'perspective', ja: '視点' },
        { en: 'complicated', ja: '複雑な' },
        { en: 'imagination', ja: '想像力' },
        { en: 'curiosity', ja: '好奇心' },
        { en: 'hypothesis', ja: '仮説' },
        { en: 'uncertainty', ja: '不確実性' },
        { en: 'evolution', ja: '進化' },
        { en: 'consequence', ja: '結果' },
        { en: 'sophisticated', ja: '洗練された' },
        { en: 'comprehensive', ja: '包括的な' },
        { en: 'phenomenon', ja: '現象' },
        { en: 'infrastructure', ja: '基盤' }
    ],
    horror: [
        { en: 'blood', ja: '血' },
        { en: 'skeleton', ja: '骸骨' },
        { en: 'nightmare', ja: '悪夢' },
        { en: 'cemetery', ja: '墓地' },
        { en: 'possession', ja: '取り憑かれること' },
        { en: 'The shadows are dancing on the wall of your room.', ja: '影が君の部屋の壁で踊っている。' },
        { en: 'Do not look back, even if you hear a whisper.', ja: 'たとえ囁き声が聞こえても、後ろを振り向くな。' },
        { en: 'Something is breathing right behind your neck.', ja: '何かが君の首のすぐ後ろで息をしている。' },
        { en: 'The mirror reflects a face that is not yours.', ja: '鏡は君のものではない顔を映し出している。' },
        { en: 'Every step you take, the floorboards scream.', ja: '君が一歩踏み出すたびに、床板が悲鳴を上げる。' }
    ]
};

let currentQuizWord = {};
let lastQuizWord = null; // 前回出した問題を覚えておく用
let currentQuizMode = 'en2ja'; // 'en2ja' (英->日) か 'ja2en' (日->英)
let consecutiveCorrectCount = 0;

const quizWordDisplay = document.getElementById('quiz-word');
const quizInput = document.getElementById('quiz-input');
const quizBtn = document.getElementById('quiz-btn');
const quizScore = document.getElementById('quiz-score');
const quizMessage = document.getElementById('quiz-message');
const quizDifficulty = document.getElementById('quiz-difficulty');

// ホラーモードのときは難易度に「ホラー」を追加する
function updateDifficultyOptions() {
    const isHorror = document.body.classList.contains('horror-mode');
    const hasHorrorOption = Array.from(quizDifficulty.options).some(opt => opt.value === 'horror');

    if (isHorror && !hasHorrorOption) {
        const horrorOpt = document.createElement('option');
        horrorOpt.value = 'horror';
        horrorOpt.innerText = '💀 ホラー';
        quizDifficulty.appendChild(horrorOpt);
        
        // ホラーモードになったら、自動的にホラー難易度を選択して開始する
        quizDifficulty.value = 'horror';
        handleQuizSettingsChange(); 
    } else if (!isHorror && hasHorrorOption) {
        // ホラーモード解除時は選択肢を消す
        for (let i = 0; i < quizDifficulty.options.length; i++) {
            if (quizDifficulty.options[i].value === 'horror') {
                quizDifficulty.remove(i);
                break;
            }
        }
    }
}

const quizType = document.getElementById('quiz-type');
const quizGameArea = document.getElementById('quiz-game-area');
const quizGuideText = document.getElementById('quiz-guide-text');

// 難易度や出題形式が変わったときにクイズをリセット・更新する共通の関数
function handleQuizSettingsChange() {
    updateDifficultyOptions(); // ホラーモードなら選択肢を増やす
    // 難易度が選ばれていないなら何もしない
    if (!quizDifficulty.value) return;

    // ゲームエリアを表示する
    quizGameArea.style.display = 'block';
    
    // スコアをリセットして次の問題へ
    consecutiveCorrectCount = 0;
    quizScore.innerText = `れんぞく正解: ${consecutiveCorrectCount} 回`;
    nextQuestion();
}

// 難易度が変わったとき
quizDifficulty.addEventListener('change', handleQuizSettingsChange);

// 出題形式が変わったとき
quizType.addEventListener('change', nextQuestion); // 形式変更時は即座に次の問題へ

// 新しい問題を出す機能
function nextQuestion() {
    const level = quizDifficulty.value;
    if (!level) return;

    const wordsPool = quizWords[level];

    // 1. 次の単語をランダムに選ぶ（前回と同じにならないように）
    let selectedWord;
    if (wordsPool.length > 1) {
        do {
            selectedWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
        } while (selectedWord === lastQuizWord);
    } else {
        selectedWord = wordsPool[0];
    }
    
    currentQuizWord = selectedWord;
    lastQuizWord = selectedWord;

    // 2. 出題モードを決定する
    const typeValue = quizType.value;
    if (typeValue === 'random') {
        currentQuizMode = Math.random() > 0.5 ? 'en2ja' : 'ja2en';
    } else {
        currentQuizMode = typeValue;
    }

    // 3. 画面の表示をモードに合わせて「強制的に」書き換える
    if (currentQuizMode === 'en2ja') {
        // 意味を答えるモード（英 -> 日）
        quizGuideText.innerHTML = "<span style='color: #764ba2; font-weight: bold;'>【意味】</span> この英単語の意味を日本語で答えてね！";
        quizWordDisplay.innerText = currentQuizWord.en;
        quizInput.placeholder = "日本語を入力してね";
    } else {
        // 筆記モード（日 -> 英）
        quizGuideText.innerHTML = "<span style='color: #e67e22; font-weight: bold;'>【筆記】</span> この日本語を英語に直してね！";
        quizWordDisplay.innerText = Array.isArray(currentQuizWord.ja) ? currentQuizWord.ja[0] : currentQuizWord.ja;
        quizInput.placeholder = "ここを英語で入力！";
    }

    // 4. 入力欄とメッセージをリセット
    quizInput.value = "";
    quizMessage.innerText = "がんばって！";
    quizMessage.style.color = "#333";
    quizInput.focus(); // 入力しやすくするためにフォーカスを合わせる
}

// 答えるボタンを押したとき
quizBtn.addEventListener('click', () => {
    const answer = quizInput.value.trim().toLowerCase(); // 英語のときは小文字で判定しやすくする
    
    if (answer === "") {
        quizMessage.innerText = "答えを入力してね！";
        return;
    }

    // 正解かどうか判定する（記号やスペースの差を無視するように優しくする）
    let isCorrect = false;
    let correctAnswer = "";

    const normalize = (str) => str.toLowerCase().replace(/[.,?!]/g, "").replace(/\s+/g, " ").trim();
    const normalizedAnswer = normalize(answer);

    if (currentQuizMode === 'en2ja') {
        const correctAnswers = Array.isArray(currentQuizWord.ja) ? currentQuizWord.ja : [currentQuizWord.ja];
        isCorrect = correctAnswers.some(ans => normalize(ans) === normalizedAnswer);
        correctAnswer = correctAnswers[0];
    } else {
        const correctAnswers = Array.isArray(currentQuizWord.en) ? currentQuizWord.en : [currentQuizWord.en];
        isCorrect = correctAnswers.some(ans => normalize(ans) === normalizedAnswer);
        correctAnswer = correctAnswers[0];
    }

    if (isCorrect) {
        // 正解のとき
        consecutiveCorrectCount++;

        // 難易度別クリアカウント処理
        if (quizDifficulty.value) {
            const lvl = quizDifficulty.value;
            if (lvl === 'expert') {
                if (consecutiveCorrectCount === 20) {
                    document.body.className = '';
                    document.body.classList.add('super-god-mode');
                    alert("🌟 隠しコマンド【超神様的翻訳君】が解放されました！\n合言葉は「どうやってここまで」です。");
                }
            } else if (lvl === 'horror') {
                if (consecutiveCorrectCount === 20) {
                    document.body.className = '';
                    document.body.classList.add('true-horror-mode');
                    alert("🩸 隠しコマンド【真・ホラー翻訳君】が解放されました...\n合言葉は「恐怖体験」です。");
                }
            } else {
                quizClearCounts[lvl] = (quizClearCounts[lvl] || 0) + 1;
                if (quizClearCounts[lvl] === 20) {
                    document.body.className = '';
                    if (lvl === 'easy') { document.body.classList.add('cheap-mode'); alert("📦 隠しコマンド【100均翻訳君】が解放されました！\n合言葉は「安物」です。"); }
                    else if (lvl === 'peaceful') { document.body.classList.add('dragon-mode'); alert("🔥 隠しコマンド【龍玉翻訳君】が解放されました！\n合言葉は「ドラゴンとボール」です。"); }
                    else if (lvl === 'normal') { document.body.classList.add('angel-demon-mode'); alert("⚖️ 隠しコマンド【天使と悪魔の翻訳君】が解放されました！\n合言葉は「エンマ大王」です。"); }
                    else if (lvl === 'hard') { document.body.classList.add('cyber-mode'); alert("💻 隠しコマンド【サイバー翻訳君】が解放されました！\n合言葉は「ハッカー」です。"); }
                }
            }
        }

        quizScore.innerText = `れんぞく正解: ${consecutiveCorrectCount} 回`;
        quizMessage.innerText = "⭕ 大正解！";
        quizMessage.style.color = "#28a745";

        // 連続正解数に応じて隠しコマンドのヒントを出す！
        if (consecutiveCorrectCount === 3) {
            alert("✨ 3問連続正解！おめでとう！ ✨\n\n【秘密のヒント：レトロ】\n入力欄に「初代翻訳君」と入れると、懐かしい姿に変身するよ！");
        } else if (consecutiveCorrectCount === 5) {
            alert("🔥 5問連続正解！すごいぞ！ 🔥\n\n【秘密のヒント：未来】\n合言葉は「マジック」。未来の力、魔法の翻訳君を呼び出そう！");
        } else if (consecutiveCorrectCount === 7) {
            alert("🌟 7問連続正解！君は天才か！？ 🌟\n\n【秘密のヒント：癒やし】\n「森の翻訳君」と入力してみて。自然の癒やしが訪れるよ。");
        } else if (consecutiveCorrectCount === 10) {
            alert("💀 10問連続正解... 足を踏み入れてしまったね... 💀\n\n【禁断の合言葉】\n「ホラー」。これを入力した時、何が起きても知らないよ...");
        }

        // 次の問題へ
        setTimeout(nextQuestion, 1500); // 1.5秒後に次の問題
    } else {
        // 不正解のとき
        consecutiveCorrectCount = 0;
        quizScore.innerText = `れんぞく正解: ${consecutiveCorrectCount} 回`;
        quizMessage.innerText = `❌ 残念！正解は「${correctAnswer}」だよ。`;
        quizMessage.style.color = "#dc3545";
        
        // 次の問題へ
        setTimeout(nextQuestion, 2000); // 2秒後に次の問題
    }
});

// 最初（さいしょ）の1問目は、難易度を選ぶまで出さないようにするよ
// nextQuestion();

// --- 追加の単語と複数解答対応ロジック ---
const existing_ja_synonyms = {
    'apple': ['りんご', 'リンゴ', '林檎', 'アップル'],
    'dog': ['犬', 'いぬ', 'イヌ', 'ドッグ'],
    'cat': ['猫', 'ねこ', 'ネコ', 'キャット'],
    'pen': ['ペン', 'ぺん'],
    'book': ['本', 'ほん', 'ホン', 'ブック'],
    'red': ['赤', 'あか', 'アカ', 'レッド'],
    'blue': ['青', 'あお', 'アオ', 'ブルー'],
    'sun': ['太陽', 'たいよう', 'タイヨウ', 'サン'],
    'milk': ['牛乳', 'ぎゅうにゅう', 'ギュウニュウ', 'ミルク'],
    'egg': ['卵', 'たまご', 'タマゴ', 'エッグ'],
    'box': ['箱', 'はこ', 'ハコ', 'ボックス'],
    'fish': ['魚', 'さかな', 'サカナ', 'フィッシュ'],
    'hat': ['帽子', 'ぼうし', 'ボウシ', 'ハット'],
    'cup': ['カップ', 'かっぷ', 'コップ'],
    'star': ['星', 'ほし', 'ホシ', 'スター'],
    'school': ['学校', 'がっこう', 'ガッコウ', 'スクール'],
    'soccer': ['サッカー', 'さっかー'],
    'water': ['水', 'みず', 'ミズ', 'ウォーター'],
    'happy': ['幸せ', 'しあわせ', 'シアワセ', 'ハッピー', '幸福'],
    'friend': ['友達', 'ともだち', 'トモダチ', 'フレンド', '友人'],
    'music': ['音楽', 'おんがく', 'オンガク', 'ミュージック'],
    'tennis': ['テニス', 'てにす'],
    'lunch': ['昼食', 'ちゅうしょく', 'チュウショク', 'ランチ', 'お昼ご飯', 'おひるごはん'],
    'bread': ['パン', 'ぱん'],
    'fruit': ['果物', 'くだもの', 'フルーツ'],
    'garden': ['庭', 'にわ', 'ニワ', 'ガーデン'],
    'train': ['電車', 'でんしゃ', 'デンシャ', 'トレイン'],
    'winter': ['冬', 'ふゆ', 'フユ', 'ウィンター'],
    'summer': ['夏', 'なつ', 'ナツ', 'サマー'],
    'flower': ['花', 'はな', 'ハナ', 'フラワー'],
    'library': ['図書館', 'としょかん', 'トショカン', 'ライブラリ'],
    'practice': ['練習', 'れんしゅう', 'レンシュウ', 'プラクティス'],
    'grammar': ['文法', 'ぶんぽう', 'ブンポウ', 'グラマー'],
    'subject': ['主語', 'しゅご', 'シュゴ', 'サブジェクト'],
    'verb': ['動詞', 'どうし', 'ドウシ', 'バーブ'],
    'noun': ['名詞', 'めいし', 'メイシ', 'ナウン'],
    'adjective': ['形容詞', 'けいようし', 'ケイヨウシ', 'アドジェクティブ'],
    'translate': ['翻訳', 'ほんやく', 'ホンヤク', '翻訳する', 'トランスレート'],
    'correct': ['正解', 'せいかい', 'セイカイ', '正しい', 'ただしい'],
    'incorrect': ['不正解', 'ふせいかい', 'フセイカイ', '間違っている', 'まちがっている'],
    'dictionary': ['辞書', 'じしょ', 'ジショ', 'ディクショナリー', '辞典'],
    'sentence': ['文章', 'ぶんしょう', 'ブンショウ', '文', 'ぶん', 'センテンス'],
    'meaning': ['意味', 'いみ', 'イミ', 'ミーニング'],
    'pronoun': ['代名詞', 'だいめいし', 'ダイメイシ'],
    'preposition': ['前置詞', 'ぜんちし', 'ゼンチシ'],
    'pronunciation': ['発音', 'はつおん', 'ハツオン'],
    'recognition': ['認識', 'にんしき', 'ニンシキ'],
    'analysis': ['解析', 'かいせき', 'カイセキ', '分析', 'ぶんせき'],
    'determine': ['決定する', 'けっていする', 'ケッテイスル', '決める', 'きめる'],
    'feedback': ['フィードバック', 'ふぃーどばっく', '反応', 'はんのう'],
    'instruction': ['指示', 'しじ', 'シジ', '命令', 'めいれい'],
    'experience': ['経験', 'けいけん', 'ケイケン', '体験', 'たいけん'],
    'environment': ['環境', 'かんきょう', 'カンキョウ'],
    'description': ['説明', 'せつめい', 'セツメイ', '記述', 'きじゅつ'],
    'opportunity': ['機会', 'きかい', 'キカイ', 'チャンス'],
    'knowledge': ['知識', 'ちしき', 'チシキ'],
    'challenge': ['挑戦', 'ちょうせん', 'チョウセン', '課題', 'かだい', 'チャレンジ'],
    'significant': ['重要な', 'じゅうような', 'ジュウヨウナ', '重大な', 'じゅうだいな'],
    'potential': ['可能性', 'かのうせい', 'カノウセイ', '潜在的な', 'せんざいてきな'],
    'efficient': ['効率的な', 'こうりつてきな', 'コウリツテキナ'],
    'philosophy': ['哲学', 'てつがく', 'テツガク', 'フィロソフィー'],
    'strategy': ['戦略', 'せんりゃく', 'センリャク', 'ストラテジー'],
    'consciousness': ['意識', 'いしき', 'イシキ'],
    'perspective': ['視点', 'してん', 'シテン', '観点', 'かんてん'],
    'complicated': ['複雑な', 'ふくざつな', 'フクザツナ', '入り組んだ', 'いりくんだ'],
    'imagination': ['想像力', 'そうぞうりょく', 'ソウゾウリョク', '想像', 'そうぞう'],
    'curiosity': ['好奇心', 'こうきしん', 'コウキシン'],
    'hypothesis': ['仮説', 'かせつ', 'カセツ'],
    'uncertainty': ['不確実性', 'ふかくじつせい', 'フカクジツセイ', '不確実', 'ふかくじつ'],
    'evolution': ['進化', 'しんか', 'シンカ', '発展', 'はってん'],
    'consequence': ['結果', 'けっか', 'ケッカ', '成り行き', 'なりゆき'],
    'sophisticated': ['洗練された', 'せんれんされた', '高度な', 'こうどな'],
    'comprehensive': ['包括的な', 'ほうかつてきな', 'ホウカツテキナ', '総合的な', 'そうごうてきな'],
    'phenomenon': ['現象', 'げんしょう', 'ゲンショウ', '事象', 'じしょう'],
    'infrastructure': ['基盤', 'きばん', 'キバン', 'インフラ', 'インフラストラクチャー'],
    'blood': ['血', 'ち', 'チ', '血液', 'けつえき'],
    'skeleton': ['骸骨', 'がいこつ', 'ガイコツ', 'スケルトン'],
    'nightmare': ['悪夢', 'あくむ', 'アクム', 'ナイトメア'],
    'cemetery': ['墓地', 'ぼち', 'ボチ', 'お墓', 'おはか'],
    'possession': ['取り憑かれること', 'とりつかれること', '憑依', 'ひょうい'],
    'The shadows are dancing on the wall of your room.': ['影が君の部屋の壁で踊っている。', 'かげがきみのへやのかべでおどっている。', 'カゲガキミノヘヤノカベデオドッテイル。', '影が君の部屋の壁で踊っている'],
    'Do not look back, even if you hear a whisper.': ['たとえ囁き声が聞こえても、後ろを振り向くな。', 'たとえささやきごえがきこえても、うしろをふりむくな。', 'たとえ囁き声が聞こえても、後ろを振り向くな'],
    'Something is breathing right behind your neck.': ['何かが君の首のすぐ後ろで息をしている。', 'なにかがきみのくびのすぐうしろでいきをしている。', '何かが君の首のすぐ後ろで息をしている'],
    'The mirror reflects a face that is not yours.': ['鏡は君のものではない顔を映し出している。', 'かがみはきみのものではないかおをうつしだしている。', '鏡は君のものではない顔を映し出している'],
    'Every step you take, the floorboards scream.': ['君が一歩踏み出すたびに、床板が悲鳴を上げる。', 'きみがいっぽふみだすたびに、ゆかいたがひめいをあげる。', '君が一歩踏み出すたびに、床板が悲鳴を上げる']
};

const new_words_add = {
    'peaceful': [
        {'en': 'boy', 'ja': ['男の子', 'おとこのこ', 'ボーイ']},
        {'en': 'girl', 'ja': ['女の子', 'おんなのこ', 'ガール']},
        {'en': 'mother', 'ja': ['母', 'はは', 'お母さん', 'おかあさん', 'マザー']},
        {'en': 'father', 'ja': ['父', 'ちち', 'お父さん', 'おとうさん', 'ファザー']},
        {'en': 'brother', 'ja': ['兄', '弟', 'あに', 'おとうと', '兄弟', 'きょうだい', 'ブラザー']},
        {'en': 'sister', 'ja': ['姉', '妹', 'あね', 'いもうと', '姉妹', 'しまい', 'シスター']},
        {'en': 'hand', 'ja': ['手', 'て', 'ハンド']},
        {'en': 'foot', 'ja': ['足', 'あし', 'フット']},
        {'en': 'eye', 'ja': ['目', 'め', 'アイ']},
        {'en': 'ear', 'ja': ['耳', 'みみ', 'イヤー']},
        {'en': 'mouth', 'ja': ['口', 'くち', 'マウス']},
        {'en': 'nose', 'ja': ['鼻', 'はな', 'ノーズ']},
        {'en': 'hair', 'ja': ['髪', 'かみ', '髪の毛', 'かみのけ', 'ヘア']},
        {'en': 'face', 'ja': ['顔', 'かお', 'フェイス']},
        {'en': 'bird', 'ja': ['鳥', 'とり', 'バード']},
        {'en': 'pig', 'ja': ['豚', 'ぶた', 'ピッグ']},
        {'en': 'cow', 'ja': ['牛', 'うし', 'カウ']},
        {'en': 'horse', 'ja': ['馬', 'うま', 'ホース']},
        {'en': 'tree', 'ja': ['木', 'き', 'ツリー']},
        {'en': 'leaf', 'ja': ['葉', 'は', '葉っぱ', 'はっぱ', 'リーフ']},
        {'en': 'grass', 'ja': ['草', 'くさ', 'グラス']},
        {'en': 'mountain', 'ja': ['山', 'やま', 'マウンテン']},
        {'en': 'river', 'ja': ['川', 'かわ', 'リバー']},
        {'en': 'sea', 'ja': ['海', 'うみ', 'シー']},
        {'en': 'sky', 'ja': ['空', 'そら', 'スカイ']},
        {'en': 'cloud', 'ja': ['雲', 'くも', 'クラウド']},
        {'en': 'rain', 'ja': ['雨', 'あめ', 'レイン']},
        {'en': 'snow', 'ja': ['雪', 'ゆき', 'スノー']},
        {'en': 'wind', 'ja': ['風', 'かぜ', 'ウインド']},
        {'en': 'fire', 'ja': ['火', 'ひ', 'ファイヤー']}
    ],
    'easy': [
        {'en': 'color', 'ja': ['色', 'いろ', 'カラー']},
        {'en': 'black', 'ja': ['黒', 'くろ', 'ブラック']},
        {'en': 'white', 'ja': ['白', 'しろ', 'ホワイト']},
        {'en': 'green', 'ja': ['緑', 'みどり', 'グリーン']},
        {'en': 'yellow', 'ja': ['黄色', 'きいろ', 'イエロー']},
        {'en': 'orange', 'ja': ['オレンジ', 'おれんじ', '橙色', 'だいいろ']},
        {'en': 'pink', 'ja': ['ピンク', 'ぴんく', '桃色', 'ももいろ']},
        {'en': 'purple', 'ja': ['紫', 'むらさき', 'パープル']},
        {'en': 'brown', 'ja': ['茶色', 'ちゃいろ', 'ブラウン']},
        {'en': 'gray', 'ja': ['灰色', 'はいいろ', 'グレー', 'グレイ']},
        {'en': 'number', 'ja': ['数', 'かず', '数字', 'すうじ', 'ナンバー']},
        {'en': 'one', 'ja': ['一', 'いち', 'ワン']},
        {'en': 'two', 'ja': ['二', 'に', 'ツー']},
        {'en': 'three', 'ja': ['三', 'さん', 'スリー']},
        {'en': 'four', 'ja': ['四', 'し', 'よん', 'フォー']},
        {'en': 'five', 'ja': ['五', 'ご', 'ファイブ']},
        {'en': 'six', 'ja': ['六', 'ろく', 'シックス']},
        {'en': 'seven', 'ja': ['七', 'しち', 'なな', 'セブン']},
        {'en': 'eight', 'ja': ['八', 'はち', 'エイト']},
        {'en': 'nine', 'ja': ['九', 'きゅう', 'く', 'ナイン']},
        {'en': 'ten', 'ja': ['十', 'じゅう', 'テン']},
        {'en': 'morning', 'ja': ['朝', 'あさ', 'モーニング']},
        {'en': 'afternoon', 'ja': ['午後', 'ごご', 'アフタヌーン']},
        {'en': 'evening', 'ja': ['夕方', 'ゆうがた', 'イブニング']},
        {'en': 'night', 'ja': ['夜', 'よる', 'ナイト']},
        {'en': 'today', 'ja': ['今日', 'きょう', 'トゥデイ']},
        {'en': 'tomorrow', 'ja': ['明日', 'あした', 'あす', 'トゥモロー']},
        {'en': 'yesterday', 'ja': ['昨日', 'きのう', 'イエスタデイ']},
        {'en': 'week', 'ja': ['週', 'しゅう', 'ウィーク']},
        {'en': 'year', 'ja': ['年', 'とし', 'ねん', 'イヤー']}
    ],
    'normal': [
        {'en': 'company', 'ja': ['会社', 'かいしゃ', 'カンパニー']},
        {'en': 'business', 'ja': ['ビジネス', 'びじねす', '仕事', 'しごと', '商売', 'しょうばい']},
        {'en': 'office', 'ja': ['オフィス', 'おふぃす', '事務所', 'じむしょ']},
        {'en': 'market', 'ja': ['市場', 'しじょう', 'いちば', 'マーケット']},
        {'en': 'price', 'ja': ['価格', 'かかく', '値段', 'ねだん', 'プライス']},
        {'en': 'cost', 'ja': ['費用', 'ひよう', 'コスト', '経費', 'けいひ']},
        {'en': 'value', 'ja': ['価値', 'かち', 'バリュー']},
        {'en': 'quality', 'ja': ['品質', 'ひんしつ', 'クオリティ', '質', 'しつ']},
        {'en': 'product', 'ja': ['製品', 'せいひん', 'プロダクト', '商品', 'しょうひん']},
        {'en': 'service', 'ja': ['サービス', 'さーびす', '奉仕', 'ほうし']},
        {'en': 'customer', 'ja': ['顧客', 'こきゃく', '客', 'きゃく', 'カスタマー']},
        {'en': 'manager', 'ja': ['マネージャー', 'まねーじゃー', '支配人', 'しはいにん']},
        {'en': 'employee', 'ja': ['従業員', 'じゅうぎょういん', '社員', 'しゃいん']},
        {'en': 'director', 'ja': ['取締役', 'とりしまりやく', 'ディレクター', '監督', 'かんとく']},
        {'en': 'president', 'ja': ['大統領', 'だいとうりょう', '社長', 'しゃちょう', 'プレジデント']},
        {'en': 'government', 'ja': ['政府', 'せいふ', 'ガバメント']},
        {'en': 'country', 'ja': ['国', 'くに', 'カントリー']},
        {'en': 'state', 'ja': ['州', 'しゅう', '状態', 'じょうたい', 'ステート']},
        {'en': 'city', 'ja': ['都市', 'とし', '市', 'し', 'シティ']},
        {'en': 'town', 'ja': ['町', 'まち', 'タウン']},
        {'en': 'village', 'ja': ['村', 'むら', 'ビレッジ']},
        {'en': 'street', 'ja': ['通り', 'とおり', '道', 'みち', 'ストリート']},
        {'en': 'road', 'ja': ['道路', 'どうろ', '道', 'みち', 'ロード']},
        {'en': 'bridge', 'ja': ['橋', 'はし', 'ブリッジ']},
        {'en': 'building', 'ja': ['建物', 'たてもの', 'ビル']},
        {'en': 'house', 'ja': ['家', 'いえ', 'ハウス']},
        {'en': 'room', 'ja': ['部屋', 'へや', 'ルーム']},
        {'en': 'wall', 'ja': ['壁', 'かべ', 'ウォール']},
        {'en': 'floor', 'ja': ['床', 'ゆか', 'フロア']},
        {'en': 'ceiling', 'ja': ['天井', 'てんじょう', 'シーリング']}
    ],
    'hard': [
        {'en': 'agriculture', 'ja': ['農業', 'のうぎょう', 'アグリカルチャー']},
        {'en': 'industry', 'ja': ['産業', 'さんぎょう', '工業', 'こうぎょう', 'インダストリー']},
        {'en': 'economy', 'ja': ['経済', 'けいざい', 'エコノミー']},
        {'en': 'technology', 'ja': ['技術', 'ぎじゅつ', 'テクノロジー']},
        {'en': 'science', 'ja': ['科学', 'かがく', 'サイエンス']},
        {'en': 'engineering', 'ja': ['工学', 'こうがく', 'エンジニアリング']},
        {'en': 'medicine', 'ja': ['医学', 'いがく', '薬', 'くすり', 'メディスン']},
        {'en': 'surgery', 'ja': ['手術', 'しゅじゅつ', 'サージェリー']},
        {'en': 'disease', 'ja': ['病気', 'びょうき', '疾患', 'しっかん', 'ディジーズ']},
        {'en': 'treatment', 'ja': ['治療', 'ちりょう', 'トリートメント', '扱い', 'あつかい']},
        {'en': 'psychology', 'ja': ['心理学', 'しんりがく', 'サイコロジー']},
        {'en': 'philosophy', 'ja': ['哲学', 'てつがく', 'フィロソフィー']},
        {'en': 'literature', 'ja': ['文学', 'ぶんがく', 'リテラチャー']},
        {'en': 'history', 'ja': ['歴史', 'れきし', 'ヒストリー']},
        {'en': 'geography', 'ja': ['地理学', 'ちりがく', '地理', 'ちり', 'ジオグラフィー']},
        {'en': 'mathematics', 'ja': ['数学', 'すうがく', 'マスマティクス']},
        {'en': 'physics', 'ja': ['物理学', 'ぶつりがく', '物理', 'ぶつり', 'フィジックス']},
        {'en': 'chemistry', 'ja': ['化学', 'かがく', 'ケミストリー']},
        {'en': 'biology', 'ja': ['生物学', 'せいぶつがく', 'バイオロジー']},
        {'en': 'astronomy', 'ja': ['天文学', 'てんもんがく', 'アストロノミー']},
        {'en': 'environment', 'ja': ['環境', 'かんきょう', 'エンバイロメント']},
        {'en': 'pollution', 'ja': ['汚染', 'おせん', 'ポリューション', '公害', 'こうがい']},
        {'en': 'climate', 'ja': ['気候', 'きこう', 'クライメート']},
        {'en': 'temperature', 'ja': ['温度', 'おんど', '気温', 'きおん', 'テンパラチャー']},
        {'en': 'atmosphere', 'ja': ['大気', 'たいき', '雰囲気', 'ふんいき', 'アトモスフィア']},
        {'en': 'planet', 'ja': ['惑星', 'わくせい', 'プラネット']},
        {'en': 'universe', 'ja': ['宇宙', 'うちゅう', 'ユニバース']},
        {'en': 'galaxy', 'ja': ['銀河', 'ぎんが', 'ギャラクシー']},
        {'en': 'satellite', 'ja': ['衛星', 'えいせい', 'サテライト']},
        {'en': 'orbit', 'ja': ['軌道', 'きどう', 'オービット']}
    ],
    'expert': [
        {'en': 'ambiguity', 'ja': ['曖昧さ', 'あいまいさ', 'アンビギュイティ']},
        {'en': 'paradigm', 'ja': ['パラダイム', 'ぱらだいむ', '模範', 'もはん']},
        {'en': 'epistemology', 'ja': ['認識論', 'にんしきろん', 'エピステモロジー']},
        {'en': 'ontology', 'ja': ['存在論', 'そんざいろん', 'オントロジー']},
        {'en': 'methodology', 'ja': ['方法論', 'ほうほうろん', 'メソドロジー']},
        {'en': 'dichotomy', 'ja': ['二分法', 'にぶんほう', 'ダイコトミー']},
        {'en': 'hegemony', 'ja': ['覇権', 'はけん', 'ヘゲモニー']},
        {'en': 'ideology', 'ja': ['イデオロギー', 'いでおろぎー', '思想', 'しそう']},
        {'en': 'bureaucracy', 'ja': ['官僚制', 'かんりょうせい', 'ビューロクラシー']},
        {'en': 'aristocracy', 'ja': ['貴族政治', 'きぞくせいじ', 'アリストクラシー']},
        {'en': 'democracy', 'ja': ['民主主義', 'みんしゅしゅぎ', 'デモクラシー']},
        {'en': 'autocracy', 'ja': ['独裁政治', 'どくさいせいじ', 'オートクラシー']},
        {'en': 'oligarchy', 'ja': ['寡頭政治', 'かとうせいじ', 'オリガルキー']},
        {'en': 'plutocracy', 'ja': ['金権政治', 'きんけんせいじ', 'プルトクラシー']},
        {'en': 'meritocracy', 'ja': ['実力主義', 'じつりょくしゅぎ', 'メリトクラシー']},
        {'en': 'technocracy', 'ja': ['技術者統治', 'ぎじゅつしゃとうち', 'テクノクラシー']},
        {'en': 'theocracy', 'ja': ['神権政治', 'しんけんせいじ', 'セオクラシー']},
        {'en': 'anarchy', 'ja': ['無政府状態', 'むせいふじょうたい', 'アナーキー']},
        {'en': 'sovereignty', 'ja': ['主権', 'しゅけん', 'ソブリンティ']},
        {'en': 'jurisdiction', 'ja': ['管轄権', 'かんかつけん', 'ジュリスディクション']},
        {'en': 'legislation', 'ja': ['法律', 'ほうりつ', '立法', 'りっぽう', 'レジスレーション']},
        {'en': 'constitution', 'ja': ['憲法', 'けんぽう', 'コンスティチューション']},
        {'en': 'amendment', 'ja': ['修正', 'しゅうせい', 'アメンドメント', '改正', 'かいせい']},
        {'en': 'ratification', 'ja': ['批准', 'ひじゅん', 'ラティフィケーション']},
        {'en': 'treaty', 'ja': ['条約', 'じょうやく', 'トリーティ']},
        {'en': 'alliance', 'ja': ['同盟', 'どうめい', 'アライアンス']},
        {'en': 'coalition', 'ja': ['連立', 'れんりつ', 'コウアリション']},
        {'en': 'federation', 'ja': ['連邦', 'れんぽう', 'フェデレーション']},
        {'en': 'republic', 'ja': ['共和国', 'きょうわこく', 'リパブリック']},
        {'en': 'empire', 'ja': ['帝国', 'ていこく', 'エンパイア']}
    ],
    'horror': [
        {'en': 'ghost', 'ja': ['幽霊', 'ゆうれい', 'ゴースト', 'おばけ', 'お化け']},
        {'en': 'monster', 'ja': ['怪物', 'かいぶつ', 'モンスター', '化け物', 'ばけもの']},
        {'en': 'demon', 'ja': ['悪魔', 'あくま', 'デーモン']},
        {'en': 'devil', 'ja': ['悪魔', 'あくま', 'デビル']},
        {'en': 'witch', 'ja': ['魔女', 'まじょ', 'ウィッチ']},
        {'en': 'vampire', 'ja': ['吸血鬼', 'きゅうけつき', 'ヴァンパイア', 'バンパイア']},
        {'en': 'zombie', 'ja': ['ゾンビ', 'ぞんび']},
        {'en': 'mummy', 'ja': ['ミイラ', 'みいら', 'マミー']},
        {'en': 'werewolf', 'ja': ['狼男', 'おおかみおとこ', 'ワーウルフ']},
        {'en': 'frankenstein', 'ja': ['フランケンシュタイン', 'ふらんけんしゅたいん']},
        {'en': 'scream', 'ja': ['悲鳴', 'ひめい', 'スクリーム', '叫び', 'さけび']},
        {'en': 'terror', 'ja': ['恐怖', 'きょうふ', 'テラー']},
        {'en': 'panic', 'ja': ['パニック', 'ぱにっく', '恐慌', 'きょうこう']},
        {'en': 'fear', 'ja': ['恐れ', 'おそれ', '恐怖', 'きょうふ', 'フィアー']},
        {'en': 'fright', 'ja': ['恐怖', 'きょうふ', 'フライト', '驚き', 'おどろき']},
        {'en': 'dread', 'ja': ['不安', 'ふあん', '恐怖', 'きょうふ', 'ドレッド']},
        {'en': 'horror', 'ja': ['ホラー', 'ほらー', '恐怖', 'きょうふ']},
        {'en': 'macabre', 'ja': ['不気味な', 'ぶきみな', 'マカブル', '気味が悪い', 'きみがわるい']},
        {'en': 'creepy', 'ja': ['気味が悪い', 'きみがわるい', 'クリーピー', '不気味な', 'ぶきみな']},
        {'en': 'spooky', 'ja': ['気味が悪い', 'きみがわるい', 'スプーキー', '幽霊が出そうな', 'ゆうれいがでそうな']},
        {'en': 'eerie', 'ja': ['不気味な', 'ぶきみな', 'イーリー']},
        {'en': 'sinister', 'ja': ['邪悪な', 'じゃあくな', 'シニスター']},
        {'en': 'evil', 'ja': ['悪', 'あく', 'イービル', '邪悪', 'じゃあく']},
        {'en': 'wicked', 'ja': ['邪悪な', 'じゃあくな', 'ウィキッド']},
        {'en': 'curse', 'ja': ['呪い', 'のろい', 'カース']},
        {'en': 'spell', 'ja': ['呪文', 'じゅもん', 'スペル']},
        {'en': 'magic', 'ja': ['魔法', 'まほう', 'マジック']},
        {'en': 'sorcery', 'ja': ['魔法', 'まほう', 'ソーサリー', '魔術', 'まじゅつ']},
        {'en': 'witchcraft', 'ja': ['魔術', 'まじゅつ', 'ウィッチクラフト']},
        {'en': 'wizardry', 'ja': ['魔法', 'まほう', 'ウィザードリー', '魔術', 'まじゅつ']}
    ]
};

// 実行時にquizWordsを拡張
for (const level in quizWords) {
    if (quizWords[level]) {
        quizWords[level] = quizWords[level].map(item => {
            if (existing_ja_synonyms[item.en]) {
                return { en: item.en, ja: existing_ja_synonyms[item.en] };
            }
            return { en: item.en, ja: [item.ja] };
        });

        if (new_words_add[level]) {
            quizWords[level].push(...new_words_add[level]);
        }
    }
}
