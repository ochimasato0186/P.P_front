import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";

type TrueFalseQuestion = {
  type: "trueFalse";
  questionNumber: string;
  text: string;
  difficulty: string;
  category: string;
  answer: string; // "〇" or "✕"
  explanation: string;
  reference: string;
};

type MultipleChoiceQuestion = {
  type: "multipleChoice";
  category: string;
  difficulty: string;
  text: string;
  options: [string, string, string, string];
  correctAnswer: number; // 1-4
  explanation: string;
  reference: string;
};

type Question = TrueFalseQuestion | MultipleChoiceQuestion;

const languageMap: Record<string, string> = {
  日本語: "nihongo",
  関西弁: "kansai",

  // Alias labels used in language.json / UI select values.
  English: "eigo",
  英語: "eigo",

  中文: "chugoku",
  中国語: "chugoku",

  "Tiếng Việt": "betonamu",
  ベトナム語: "betonamu",

  "한국어": "kankoku",
  韓国語: "kankoku",

  "ภาษาไทย": "tai",
  タイ語: "tai",

  スペイン語: "supein",
};

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function parseCSV(content: string, headers: string[]): Record<string, string>[] {
  const lines: string[] = [];
  let currentLine = "";
  let insideQuotes = false;

  // クォート処理を考慮してCSVを行ごとに分割
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"' && nextChar === '"') {
      // ダブルクォート（エスケープ）
      currentLine += '"';
      i++;
    } else if (char === '"') {
      // クォート切り替え
      insideQuotes = !insideQuotes;
      currentLine += char;
    } else if (char === "\n" && !insideQuotes) {
      // 行末（クォート外）
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = "";
    } else if (char === "\r") {
      // CR スキップ
      continue;
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length < 2) return [];

  // CSVの値をパース
  const parseRow = (line: string): string[] => {
    const values: string[] = [];
    let currentValue = "";
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"' && nextChar === '"') {
        // ダブルクォート（エスケープ）
        currentValue += '"';
        i++;
      } else if (char === '"') {
        // クォート切り替え
        insideQuotes = !insideQuotes;
      } else if (char === "," && !insideQuotes) {
        // 値の区切り
        values.push(currentValue.trim().replace(/^"|"$/g, ""));
        currentValue = "";
      } else {
        currentValue += char;
      }
    }

    values.push(currentValue.trim().replace(/^"|"$/g, ""));
    return values;
  };

  return lines.slice(1).map((line) => {
    const values = parseRow(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || "";
    });
    return row;
  });
}

function getTrueFalseFileName(languageDir: string): string {
  if (languageDir === "kansai") {
    return "○×問題(関西弁版) 1.csv";
  }
  return `○×問題(${getLanguageName(languageDir)}).csv`;
}

function getLanguageName(languageDir: string): string {
  const nameMap: Record<string, string> = {
    nihongo: "日本語",
    eigo: "英語",
    chugoku: "中国語",
    betonamu: "ベトナム語",
    kankoku: "韓国語",
    tai: "タイ語",
    supein: "スペイン語",
    kansai: "関西弁",
  };
  return nameMap[languageDir] || "日本語";
}

async function loadTrueFalseQuestions(languageDir: string): Promise<TrueFalseQuestion[]> {
  const fileName = getTrueFalseFileName(languageDir);
  const filePath = path.join(process.cwd(), "csv", languageDir, fileName);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const headers = ["問題番号", "問題文", "難易度", "カテゴリ", "正解", "解説", "法令参照"];
    const rows = parseCSV(content, headers);

    return rows
      .filter((row) => row["問題番号"] && row["問題文"])
      .map((row) => ({
        type: "trueFalse" as const,
        questionNumber: row["問題番号"],
        text: row["問題文"],
        difficulty: row["難易度"],
        category: row["カテゴリ"],
        answer: row["正解"],
        explanation: row["解説"],
        reference: row["法令参照"],
      }));
  } catch (error) {
    console.error("Error loading true/false questions:", error);
    return [];
  }
}

async function loadMultipleChoiceQuestions(languageDir: string): Promise<MultipleChoiceQuestion[]> {
  const fileName = `選択問題(${getLanguageName(languageDir)}).csv`;
  const filePath = path.join(process.cwd(), "csv", languageDir, fileName);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const headers = ["カテゴリ", "難易度", "問題文", "選択肢１", "選択肢２", "選択肢３", "選択肢４", "正解番号", "解説", "関連交通ルール"];
    const rows = parseCSV(content, headers);

    return rows
      .filter((row) => row["問題文"] && row["選択肢１"])
      .map((row) => ({
        type: "multipleChoice" as const,
        category: row["カテゴリ"],
        difficulty: row["難易度"],
        text: row["問題文"],
        options: [row["選択肢１"], row["選択肢２"], row["選択肢３"], row["選択肢４"]] as [string, string, string, string],
        correctAnswer: parseInt(row["正解番号"], 10),
        explanation: row["解説"],
        reference: row["関連交通ルール"],
      }));
  } catch (error) {
    console.error("Error loading multiple choice questions:", error);
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");

    if (!language || !languageMap[language]) {
      return NextResponse.json(
        { message: "Invalid or missing language parameter" },
        { status: 400 }
      );
    }

    const languageDir = languageMap[language];

    // Load questions from CSV files
    const trueFalseQuestions = await loadTrueFalseQuestions(languageDir);
    const multipleChoiceQuestions = await loadMultipleChoiceQuestions(languageDir);

    if (trueFalseQuestions.length < 7 || multipleChoiceQuestions.length < 3) {
      return NextResponse.json(
        { message: "Not enough questions in CSV files" },
        { status: 400 }
      );
    }

    // Select random questions
    const selectedTrueFalse = shuffleArray(trueFalseQuestions).slice(0, 7);
    const selectedMultipleChoice = shuffleArray(multipleChoiceQuestions).slice(0, 3);

    // Combine and shuffle
    const allQuestions: Question[] = [...selectedTrueFalse, ...selectedMultipleChoice];
    const finalQuestions = shuffleArray(allQuestions);

    return NextResponse.json({
      success: true,
      questions: finalQuestions,
      totalCount: finalQuestions.length,
    });
  } catch (error) {
    console.error("Error in quiz API:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
