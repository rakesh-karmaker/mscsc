const ClubStats = () => {
  {
    /* <!-- Club stats is a section where we can show some stats about the club --> */
    /* <!--TODO Should change in every year --> */
  }
  return (
    <div className="club-stats">
      <h3>The milestones we have achieved:</h3>
      <div class="club-stats-container">
        <ClubState value="5" thousand={true}>
          Past club <br /> Members
        </ClubState>
        <ClubState value="7">
          Years of <br /> Connectivity
        </ClubState>
        <ClubState value="4">
          Successful <br /> Fests
        </ClubState>
        <ClubState value="20">
          Interesting <br /> Workshops
        </ClubState>
      </div>
    </div>
  );
};

const ClubState = ({ value, children, thousand }) => {
  return (
    <h3 class="stats">
      <span class="stats-number">
        <span class="number-value" value={value}>
          0
        </span>
        {thousand ? "K+" : "+"}
      </span>
      <span class="stats-name">{children}</span>
    </h3>
  );
};

export default ClubStats;
