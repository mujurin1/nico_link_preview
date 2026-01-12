import { createSignal } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { render } from "solid-js/web";
import { ActiveLinkDefault, activeLink, setActiveLink } from "./store/ActiveLinkStore";
import { OtherSettingDefault, otherSetting, setOtherSetting } from "./store/OtherSettingStore";
import { ActiveLinkType } from "./store/types";

render(() => <Options />, document.getElementById("app")!);


function Options(): JSX.Element {
  const [resetOk, setResetOk] = createSignal(false);

  return (
    <div style="font-size: 1.5em;">
      <h3>動作するリンクの選択</h3>
      <ActiveLink name="user" title="ユーザー（user/）" />
      <ActiveLink name="mylist" title="マイリスト（mylist/）" />
      <ActiveLink name="series" title="シリーズ（series/）" />
      <ActiveLink name="video" title="動画（sm nm watch/ so）" />
      <ActiveLink name="seiga" title="静画（im）" />
      <ActiveLink name="live" title="生放送（lv）" />
      <ActiveLink name="solid" title="立体（td）" />

      <br />

      <hr />

      <h3>その他設定</h3>
      <Slider
        title="マウスを外してからプレビューを消去するまでの時間（秒）"
        value={() => otherSetting.removeTimer}
        change={(value) => setOtherSetting("removeTimer", value)}
        min={0}
        max={10}
      />

      <hr />

      <h3>プレビューするリンクの条件（CSS セレクター）</h3>

      <div>通常はクラス名が空の aタグ のみプレビューします</div>
      <div>クラス名を持つ aタグをプレビューしたい場合は、以下に記述してください</div>

      <textarea
        style="display: block; width: 70%; font-size: 1em; font-family: ui-monospace; margin: 20px 0;"
        rows="7"
        value={otherSetting.macheSelector}
        onInput={(e) => setOtherSetting("macheSelector", e.currentTarget.value)}
      ></textarea>

      <div>・「//」で始まる行は無視されます（行中の // は関係ありません。行頭の場合のみです）</div>
      <div>
        ・参考：<a
          href="https://developer.mozilla.org/ja/docs/Web/CSS/Guides/Selectors#ガイド"
          target="_blank"
          rel="noopener noreferrer">
          CSS セレクターのガイド
        </a>
      </div>


      <hr />

      <button
        type="button"
        onClick={() => {
          if (resetOk()) {
            setActiveLink(ActiveLinkDefault);
            setOtherSetting(OtherSettingDefault);
            setResetOk(false);
          } else {
            setResetOk(true);
          }
        }}
      >{resetOk() ? "本当にリセットしますか？" : "設定をリセットする"}</button>

      <div style="margin-top: 20px;">
        ※ 全ての変更は即時反映されます（同時に開いているタブへも即時反映されます）
      </div>
    </div >
  );
};

function ActiveLink({ name, title }: { name: ActiveLinkType; title: string; }): JSX.Element {
  return (
    <Checkbox
      title={title}
      change={() => activeLink[name]}
      toggle={(checked) => setActiveLink(name, checked)}
    />
  );
}

//#region UI コンポーネント
function Checkbox({ title, change, toggle }: {
  title: string;
  change: () => boolean;
  toggle: (checked: boolean) => void;
}): JSX.Element {
  return (
    <div>
      <label style="cursor: pointer;">
        <input
          style="margin-right: 8px;"
          type="checkbox"
          checked={change()}
          onChange={(e) => toggle(e.currentTarget.checked)}
        />
        <span>{title}</span>
      </label>
    </div>
  );
}

function Slider({ title, value, change, disabled, min, max }: {
  title: string;
  value: () => number;
  change: (value: number) => void;
  disabled?: () => boolean;
  min?: number;
  max?: number;
}): JSX.Element {
  return (
    <>
      <span>{title}</span>
      <input
        style="margin: 0 8px; vertical-align: middle;"
        type="range"
        value={value()}
        onInput={(e) => change(Number(e.currentTarget.value))}
        disabled={disabled?.()}
        min={min}
        max={max}
      />
      <span>{value()}</span>
    </>
  );
}
//#endregion UI コンポーネント