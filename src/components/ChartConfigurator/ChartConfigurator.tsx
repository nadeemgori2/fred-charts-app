import React, { useState, useCallback } from "react";
import { useFredAPI } from "../../hooks/useFredAPI";
import {
  NO_RESULTS_MESSAGE,
  SEARCH_ERROR_MESSAGE,
  SEARCHING_MESSAGE,
} from "../../constants/messages";
import { CHART_TYPES, FREQUENCY_OPTIONS } from "../../constants/options";
import { debounce } from "../../utils/debounce";
import "./ChartConfigurator.css";
import { Props } from "../../models/Model";

const ChartConfigurator: React.FC<Props> = ({ onUpdateConfig }) => {
  const [config, setConfig] = useState({
    title: "",
    type: "line",
    yAxisLabel: "",
    color: "#000000",
    frequency: "m",
    dataSeries: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { searchFredSeries, loading } = useFredAPI();

  const debouncedUpdateConfig = useCallback(
    debounce((updatedConfig) => {
      onUpdateConfig(updatedConfig);
    }, 500),
    [onUpdateConfig]
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    const updatedConfig = { ...config, [name]: value };
    setConfig(updatedConfig);

    if (name === "title" || name === "yAxisLabel") {
      debouncedUpdateConfig(updatedConfig);
    } else {
      onUpdateConfig(updatedConfig);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setSearchResults([]);
    setErrorMessage(null);

    try {
      const results = await searchFredSeries(searchQuery);
      if (results.length === 0) {
        setErrorMessage(NO_RESULTS_MESSAGE);
      } else {
        setSearchResults(results);
      }
    } catch (error) {
      console.error("Error during API search:", error);
      setErrorMessage(SEARCH_ERROR_MESSAGE);
    }
  };

  const handleSelectSeries = (series: any) => {
    const updatedConfig = { ...config, dataSeries: series.id };
    setConfig(updatedConfig);
    onUpdateConfig(updatedConfig);
    setSearchResults([]);
    setSearchQuery(series.title);
  };

  return (
    <div className="chart-configurator">
      <div className="chart-configurator__row">
        <input
          type="text"
          name="title"
          placeholder="Chart Title"
          value={config.title}
          onChange={handleChange}
          className="chart-configurator__input chart-configurator__input--title"
        />
        <select
          name="type"
          value={config.type}
          onChange={handleChange}
          className="chart-configurator__select chart-configurator__select--type"
        >
          {CHART_TYPES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="yAxisLabel"
          placeholder="Y Axis Label"
          value={config.yAxisLabel}
          onChange={handleChange}
          className="chart-configurator__input chart-configurator__input--y-axis"
        />
        <input
          type="color"
          name="color"
          value={config.color}
          onChange={handleChange}
          className="chart-configurator__color-picker"
        />
      </div>

      <div className="chart-configurator__row">
        <select
          name="frequency"
          value={config.frequency}
          onChange={handleChange}
          className="chart-configurator__select chart-configurator__select--frequency"
        >
          {FREQUENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search for data series..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="chart-configurator__input chart-configurator__input--search"
        />

        <button
          onClick={handleSearch}
          disabled={loading}
          className={`chart-configurator__button ${
            loading ? "chart-configurator__button--disabled" : ""
          }`}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && (
        <div className="chart-configurator__loading">{SEARCHING_MESSAGE}</div>
      )}

      {errorMessage && (
        <div className="chart-configurator__error">{errorMessage}</div>
      )}

      {searchResults.length > 0 && (
        <ul className="chart-configurator__results">
          {searchResults.map((series) => (
            <li
              key={series.id}
              onClick={() => handleSelectSeries(series)}
              className="chart-configurator__result-item"
            >
              <span className="chart-configurator__result-id">{series.id}</span>
              <span className="chart-configurator__result-title">
                {series.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChartConfigurator;
